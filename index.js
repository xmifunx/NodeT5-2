const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { apiKey, baseUrl } = require("./config");
const API = require("./api");

const WeatherApi = new API(baseUrl, apiKey);

yargs(hideBin(process.argv))
  .command({
    command: "$0 <city>",
    description: "Текущая погода",
    builder(yargs) {
      yargs
        .positional("city", {
          description: "Название города или поселения",
          type: "string",
        })
        .example("$0 Moscow");
    },
    async handler({ city }) {
      try {
        const { current, location } = await WeatherApi.getCurrent(city);
        console.log(`
Погода по вашему запросу на текущий момент времени: ${new Date(Date.now())}
Наименование города: ${location.name}, в стране: ${location.country}
Состояние погоды: ${current.weather_descriptions}
Температура: ${current.temperature}℃
            `);
      } catch (error) {
        console.error(error);
        yargs.showHelp();
      }
      process.exit();
    },
  })
  .version(false)
  .parse();