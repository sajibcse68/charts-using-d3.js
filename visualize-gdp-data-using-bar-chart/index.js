// Author: Sajib Khan
// Date: 14 March 2021

var projectName = 'bar-chart';

var width = 800,
  height = 400,
  barWidth = width / 275;

var tooltip = d3
  .select('.chart')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('.chart')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgEl = d3
  .select('.chart')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  (e, resp) => {
    svgEl
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Gross Domestic Product');

    svgEl
      .append('text')
      .attr('x', 60)
      .attr('y', height + 50)
      .text(
        'FreeCodeCamp Link: https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart'
      )
      .attr('class', 'info');

    var data = resp.data;

    var years = data.map((d) => {
      var quarter;
      var val = d[0].substring(5, 7);

      if (val === '01') {
        quarter = 'Q1';
      } else if (val === '04') {
        quarter = 'Q2';
      } else if (val === '07') {
        quarter = 'Q3';
      } else if (val === '10') {
        quarter = 'Q4';
      }

      return d[0].substring(0, 4) + ' ' + quarter;
    });

    var yearsDate = data.map((d) => new Date(d[0]));

    var xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    var xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    var xAxis = d3.axisBottom().scale(xScale);

    svgEl
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 400)');

    var GDP = data.map((d) => d[1]);

    var scaledGDP = [];

    var gdpMax = d3.max(GDP);

    var linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

    scaledGDP = GDP.map((d) => linearScale(d));

    var yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    var yAxis = d3.axisLeft(yAxisScale);

    svgEl
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');

    d3.select('svg')
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('data-date', (d, i) => data[i][0])
      .attr('data-gdp', (d, i) => data[i][1])
      .attr('class', 'bar')
      .attr('x', (d, i) => xScale(yearsDate[i]))
      .attr('y', (d, i) => height - d)
      .attr('width', barWidth)
      .attr('height', (d) => d)
      .style('fill', '#4BBFAE')
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', function (d, i) {
        overlay
          .transition()
          .duration(0)
          .style('height', d + 'px')
          .style('width', barWidth + 'px')
          .style('opacity', 0.9)
          .style('left', i * barWidth + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translateX(60px)');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', resp.data[i][0])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  }
);
