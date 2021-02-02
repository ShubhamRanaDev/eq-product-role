const express = require('express')
const pg = require('pg').Pool
const Limiter = require('./limiter')
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express()
app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg(
    {
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT
    }
)
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);
app.use(bodyParser.json());

app.use(cors());
app.set('json spaces', 40);




const queryHandler = (req, res, next) => {

  pool.query(req.sqlQuery).then((r) => {
      //Limiter start
      const tokenc = req.header('token')
      if(tokenc !== ''){
          jwt.verify(tokenc, process.env.SECRET_KEY, (err, verifiedJwt) => {
              if(err){
                  res.json(err.message)
              }else{
                  let limiterArray = verifiedJwt.limiterArray

                  if(limiterArray.length >= 11)
                  {
                      limiterArray.pop()
                      limiterArray=[Date.now(),...limiterArray]

                      const payload = {
                          limiterArray: [limiterArray],
                      };
                      let token = jwt.sign(payload, process.env.SECRET_KEY, {
                          expiresIn: 56780,
                      });

                      if((limiterArray[0]-limiterArray[9])<50000){

                          res.status(429).json({msg:"Request limit reached",token: token})
                          console.log("api request limit reached")
                      }
                      else
                      {
                          res.status(200).json({data: r.rows || [],token: token})

                      }
                  }
                  else
                  {

                      const payload = {
                          limiterArray: [Date.now(),...limiterArray],
                      };
                      let token = jwt.sign(payload, process.env.SECRET_KEY, {
                          expiresIn: 56780,
                      });
                      res.json({data: r.rows || [],token: token});

                  }
              }
          })

      }
      else
      {
          const payload = {
              limiterArray: [Date.now()],
          };
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: 56780,
          });

              res.json({data: r.rows || [],token: token});
      }
      //Limiter end


  // return res.json({data: r.rows || [],token: token})
  }).catch(next)
}

app.get('/', Limiter, (req, res) => {
    console.log("Reached here")
    res.status(200)
})

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)


app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `
  return next()
}, queryHandler)

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `
  return next()
}, queryHandler)

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `
  return next()
}, queryHandler)

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`)
  }
})

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`)
  process.exit(1)
})
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})
