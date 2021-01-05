<template>
  <div>
    <h1>INS Lessons</h1>
    <h2>Number of lessons using INS</h2>
    <row :gutter="12">
      <column :lg="1">Countries: </column>
      <column :lg="3"
        ><v-select :options="countries" @input="changeCountry"></v-select
      ></column>
      <column :lg="1">Camps: </column>
      <column :lg="3"><v-select :options="camps"></v-select></column>
      <column :lg="1">Schools: </column>
      <column :lg="3"><v-select :options="[]"></v-select></column>
    </row>

    <row :gutter="12">
      <column :lg="8" xs-pull-12>
        <h3>No of lessons</h3>
        <line-chart :chart-data="chartData" :options="options"></line-chart>
      </column>
      <column :lg="4" xs-push-12>
        <h2 style="color:#2c3e50; text-align:center">Summary</h2>
        <div class="lesson-summary">
          <h1 style="display: inline-flex">Total {{ totalLessons }}</h1>
          <h2 style="display: inline-flex; margin-left: 10px">lessons</h2>
          <h3 style="display: inline-flex;">in {{ current }}</h3>
        </div>
        <div class="growth-rate">
          <h1 style="display: inline-flex">{{ arrow }} {{ growthRate }}%</h1>
          <h3 style="display: inline-flex;">Compare to last year</h3>
        </div>
      </column>
    </row>
  </div>
</template>

<script>
import LineChart from '../components/LineChart.js'
import {
  getCountries,
  getCamps,
  getLessonsByYear
} from '../data/data-provider.js'
import './Ins.css'

export default {
  components: {
    LineChart
  },
  data () {
    return {
      chartData: {},
      countries: [],
      camps: [],
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      current: '',
      totalLessons: '',
      arrow: '',
      growthRate: ''
    }
  },
  mounted () {
    this.countries = getCountries()
    this.changeCountry('Kenya')
    this.updateLessonSummary()
  },
  methods: {
    changeCountry: function (value) {
      this.camps = getCamps(value)
      this.updateChartData(value)
      this.current = value
      this.updateLessonSummary(value)
    },
    updateChartData (value) {
      let lessonsByYear = getLessonsByYear(value)
      let color = ''

      if (value === 'Kenya') {
        color = '#EC7181'
      } else if (value === 'Tanzania') {
        color = '#2cb5f5'
      }

      this.chartData = {
        labels: lessonsByYear.years,
        datasets: [
          {
            label: value,
            backgroundColor: 'transparent',
            borderColor: color,
            data: lessonsByYear.lessons,
            pointRadius: 6,
            pointBackgroundColor: '#FFFFFF',
            lineTension: 0
          }
        ]
      }
    },
    updateLessonSummary (value) {
      let lessonsByYear = getLessonsByYear(value)
      if (lessonsByYear.lessons.length > 0) {
        this.totalLessons = lessonsByYear.lessons.reduce(
          (prev, curr) => prev + curr
        )

        const recentYears = lessonsByYear.lessons.slice(-2)
        const oneYearBefore = recentYears[0]
        const twoYearBefore = recentYears[1]
        const growthRate = (twoYearBefore / oneYearBefore - 1) * 100

        if (oneYearBefore === 0) {
          this.arrow = '⬇'
          this.growthRate = '100'
        }

        if (growthRate !== Infinity) {
          if (growthRate > 0) {
            this.arrow = '⬆'
          } else if (growthRate < 0) {
            this.arrow = '⬇'
          } else if (growthRate === 0) {
            this.arrow = ''
          }
          this.growthRate = growthRate.toFixed(0)
        }
      }
    }
  }
}
</script>
