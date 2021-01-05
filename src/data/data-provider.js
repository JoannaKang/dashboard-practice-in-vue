const data = require('./ins-data.json')

export function getCountries () {
  const countries = []
  data.map(el => countries.push(el.country))
  const uniqueCountries = countries.filter((item, index) => countries.indexOf(item) === index)
  return uniqueCountries
}

export function getCamps (country) {
  const filteredResult = data.filter(el => el.country === country)
  const camps = filteredResult.map(el => Object.values(el.camp).join(''))
  const uniqueCamps = camps.filter((item, index) => camps.indexOf(item) === index)
  return uniqueCamps
}

export function getLessonsByYear (country) {
  const filteredResult = data.filter(el => el.country === country).sort((a, b) => a.years - b.years)
  const dict = {}

  for (let i = 0; i < filteredResult.length; i++) {
    const year = filteredResult[i].year
    if (year in dict) {
      dict[year] += filteredResult[i].lessons
    } else {
      dict[year] = filteredResult[i].lessons
    }
  };

  return {
    years: Object.keys(dict),
    lessons: Object.values(dict)
  }
}
