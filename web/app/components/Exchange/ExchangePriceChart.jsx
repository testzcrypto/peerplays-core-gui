/*
 *  Copyright (c) 2015 Cryptonomex, Inc., and contributors.
 *
 *  The MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

import React from "react";
import {connect} from 'react-redux';
import classNames from "classnames";

import HighstockThemeService from "services/HighstockThemeService";
import ExchangePageActions from "actions/ExchangePageActions";
import PeriodNameHelper from "helpers/PeriodNameHelper";

let Highstock = require('highcharts/highstock.src');

require('highcharts/modules/exporting')(Highstock);

// Apply the theme
Highstock.setOptions(HighstockThemeService.getTheme());

class ExchangePriceChart extends React.Component {

    componentWillReceiveProps(nextProps) {
        let data = nextProps.highPriceList;
        let priceData = nextProps.priceData;

        if (!this.chart) {
            // create the chart
            this.chart = new Highstock.StockChart('chart01', {
                global: {
                    useUTC: false
                },
                colors: [{
                    linearGradient: { x1: 1, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#2f97e9'],
                        [1, '#00fe95']
                    ]
                }],
                chart: {
                    alignTicks: false,
                    margin: [0, 0, 40, 0],
                    spacing: [0, 0, 0, 0]
                },

                rangeSelector: {
                    enabled: false
                },

                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                yAxis: {
                    gridLineColor: '#0f3748',
                    gridLineDashStyle: 'ShortDot',
                    gridLineWidth: 2,
                    opposite: false,
                    lineWidth: 160,
                    lineColor: "#283378",
                    labels: {
                        align: "left",
                        x: 3,
                        y: -2,
                        style: {
                            color: '#90afcf',
                            fontSize: '14px',
                            fontWeight: '500'
                        }
                    }
                },
                xAxis: {
                    tickWidth: 0,
                    crosshair: {
                        color: 'rgba(255,255,255,.2)'
                    },
                    labels: {
                        x: 100
                    },
                    min: nextProps.priceChartCurrentPeriod ? new Date().getTime() - 1000 * nextProps.priceChartCurrentPeriod: null,
                    minPadding: 0.5
                },
                navigator: {
                    margin: 0,
                    height: 45,
                    outlineWidth: 0,
                    handles: {
                        backgroundColor: '#9cc8db',
                        borderColor: '#3774b7'
                    },
                    series: {
                        lineColor: '#3597a6',
                        lineWidth: 2,
                        color: 'transparent'
                    },
                    xAxis: {
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        labels: {
                            align: 'left',
                            style: {
                                color: '#151a45',
                                fontSize: '14px',
                                fontWeight: '500'
                            },
                            x: 0,
                            y: -15
                        }
                    }
                    //enabled: false
                },
                scrollbar: {
                    barBackgroundColor: 'rgba(255,255,255,.3)',
                    barBorderColor: "#3774b7",
                    rifleColor: "#8e92b1",
                    trackBackgroundColor: "#1c2254",
                    trackBorderColor: "#1c2254",
                    buttonArrowColor: "#8e92b1",
                    buttonBackgroundColor: "#1c2254",
                    buttonBorderColor: "#1c2254"
                    //enabled: false
                },
                series: [{
                    type: 'column',
                    name: "High",
                    data: data,
                    dataGrouping: {
                        approximation: 'high',
                        enabled: true
                    }
                }

                ],
//                tooltip: {
//                    enabledIndicators: true,
//                    shared: true,
//                    borderWidth: 0,
//                    shadow: false,
//                    useHTML: true,
//                    padding: 0,
//                    formatter: function () {
//
//
//
//                        if (!this.points || this.points.length === 0) {
//                            return "";
//                        }
//console.log(this.points);
//                        return '<span>' + this.points[0].point.y + '</span>';
//                        //
//                        //return ("<span style='color: " + colors[theme].tooltipColor +";fill: "+ colors[theme].tooltipFillColor + "'>" +
//                        //"<b>Open:&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.open, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;High:&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.high, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;Time:&nbsp;&nbsp;&nbsp;</b>" + time +
//                        //"<br/><b>Close:&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.close, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;Low:&nbsp;&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.low, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;&nbsp;Vol:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1] ? this.points[0].point.y : 0, vol_dec, ".", ",") + "&nbsp;&nbsp;" + quoteSymbol + "<br/>"
//                        //+ TA + "</span>");
//
//                    },
//                    positioner: function () {
//                        return { x: 50, y: -5 };
//                    }
//                }
            });
        } else {

            if (nextProps.highPriceList !== this.props.highPriceList) {
                this.chart.series[0].setData(nextProps.highPriceList, true);
            }

            let min = 0;
            let max = 0;
            let range = 0;

            if (nextProps.highPriceList.length) {
                min = nextProps.highPriceList[0][0];
                max = nextProps.highPriceList[nextProps.highPriceList.length - 1][0];
                range = max - min;
            }

            let currTime = new Date().getTime();
            let minVal = nextProps.priceChartCurrentPeriod ? currTime - 1000 * nextProps.priceChartCurrentPeriod: min;

            ////if (!nextProps.priceChartCurrentPeriod) {

            if (nextProps.priceChartCurrentPeriod) {
                this.chart.xAxis[0].setExtremes(minVal, currTime);
                this.chart.xAxis[0].update({
                    min: minVal,
                    max: currTime,
                    range: currTime - minVal
                    //range: nextProps.priceChartCurrentPeriod ?  null : range
                });
                this.chart.xAxis[0].setExtremes();
            } else {

                this.chart = new Highstock.StockChart('chart01', {
                global: {
                    useUTC: false
                },
                colors: [{
                    linearGradient: { x1: 1, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#2f97e9'],
                        [1, '#00fe95']
                    ]
                }],
                chart: {
                    alignTicks: false,
                    margin: [0, 0, 40, 0],
                    spacing: [0, 0, 0, 0],
                    animation: false
                },

                rangeSelector: {
                    enabled: false
                },

                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                yAxis: {
                    gridLineColor: '#0f3748',
                    gridLineDashStyle: 'ShortDot',
                    gridLineWidth: 2,
                    opposite: false,
                    lineWidth: 160,
                    lineColor: "#283378",
                    labels: {
                        align: "left",
                        x: 3,
                        y: -2,
                        style: {
                            color: '#90afcf',
                            fontSize: '14px',
                            fontWeight: '500'
                        }
                    }
                },
                xAxis: {
                    tickWidth: 0,
                    crosshair: {
                        color: 'rgba(255,255,255,.2)'
                    },
                    labels: {
                        x: 100
                    },
                    min: minVal,
                    max: currTime,
                    range: currTime - minVal

                },
                navigator: {
                    margin: 0,
                    height: 45,
                    outlineWidth: 0,
                    handles: {
                        backgroundColor: '#9cc8db',
                        borderColor: '#3774b7'
                    },
                    series: {
                        lineColor: '#3597a6',
                        lineWidth: 2,
                        color: 'transparent'
                    },
                    xAxis: {
                        tickWidth: 0,
                        lineWidth: 0,
                        gridLineWidth: 0,
                        labels: {
                            align: 'left',
                            style: {
                                color: '#151a45',
                                fontSize: '14px',
                                fontWeight: '500'
                            },
                            x: 0,
                            y: -15
                        }
                    }
                    //enabled: false
                },
                scrollbar: {
                    barBackgroundColor: 'rgba(255,255,255,.3)',
                    barBorderColor: "#3774b7",
                    rifleColor: "#8e92b1",
                    trackBackgroundColor: "#1c2254",
                    trackBorderColor: "#1c2254",
                    buttonArrowColor: "#8e92b1",
                    buttonBackgroundColor: "#1c2254",
                    buttonBorderColor: "#1c2254"
                    //enabled: false
                },
                series: [{
                    type: 'column',
                    name: "High",
                    data: data,
                    dataGrouping: {
                        approximation: 'high',
                        enabled: true
                    },
                    animation: false
                }

                ],
//                tooltip: {
//                    enabledIndicators: true,
//                    shared: true,
//                    borderWidth: 0,
//                    shadow: false,
//                    useHTML: true,
//                    padding: 0,
//                    formatter: function () {
//
//
//
//                        if (!this.points || this.points.length === 0) {
//                            return "";
//                        }
//console.log(this.points);
//                        return '<span>' + this.points[0].point.y + '</span>';
//                        //
//                        //return ("<span style='color: " + colors[theme].tooltipColor +";fill: "+ colors[theme].tooltipFillColor + "'>" +
//                        //"<b>Open:&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.open, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;High:&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.high, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;Time:&nbsp;&nbsp;&nbsp;</b>" + time +
//                        //"<br/><b>Close:&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.close, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;Low:&nbsp;&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1].point.low, price_dec, ".", ",") +
//                        //"<b>&nbsp;&nbsp;&nbsp;Vol:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>" + Highcharts.numberFormat(this.points[1] ? this.points[0].point.y : 0, vol_dec, ".", ",") + "&nbsp;&nbsp;" + quoteSymbol + "<br/>"
//                        //+ TA + "</span>");
//
//                    },
//                    positioner: function () {
//                        return { x: 50, y: -5 };
//                    }
//                }
            });


            }




            //} else {
            //    this.chart.xAxis[0].setExtremes(nextProps.priceChartCurrentPeriod ? new Date().getTime() - 1000 * nextProps.priceChartCurrentPeriod: null,null);
            //    this.chart.xAxis[0].update({
            //        min: nextProps.priceChartCurrentPeriod ? new Date().getTime() - 1000 * nextProps.priceChartCurrentPeriod: null,
            //        //range: undefined
            //    });

            //}

        }


    }

    componentDidMount() {

        //let data = this.props.highPriceList;
        //
        //
        //
        //    // create the chart
        //this.chart = new Highstock.StockChart('chart01', {
        //    colors: [{
        //        linearGradient: { x1: 1, y1: 0, x2: 0, y2: 1 },
        //        stops: [
        //            [0, '#2f97e9'],
        //            [1, '#00fe95']
        //        ]
        //    }],
        //    chart: {
        //        alignTicks: false,
        //        margin: [0, 0, 40, 0],
        //        spacing: [0, 0, 0, 0]
        //    },
        //
        //    rangeSelector: {
        //        selected: 1
        //    },
        //
        //    credits: {
        //        enabled: false
        //    },
        //    title: {
        //        text: ''
        //    },
        //    subtitle: {
        //        text: ''
        //    },
        //    yAxis: {
        //        gridLineColor: '#0f3748',
        //        gridLineDashStyle: 'ShortDot',
        //        gridLineWidth: 2,
        //        opposite: false,
        //        lineWidth: 160,
        //        lineColor: "#283378",
        //        labels: {
        //            align: "left",
        //            x: 3,
        //            y: -2,
        //            style: {
        //                color: '#90afcf',
        //                fontSize: '14px',
        //                fontWeight: '500'
        //            }
        //        }
        //    },
        //    xAxis: {
        //        tickWidth: 0,
        //        crosshair: {
        //            color: 'rgba(255,255,255,.2)'
        //        }
        //    },
        //    series: [{
        //        type: 'column',
        //        //name: 'AAPL Stock Volume',
        //        data: data,
        //        dataGrouping: {
        //            units: [[
        //                'week', // unit name
        //                [1] // allowed multiples
        //            ], [
        //                'month',
        //                [1, 2, 3, 4, 6]
        //            ]]
        //        }
        //    }]
        //});
    }
    onChangePeriod(period) {
        this.props.changePriceChartPeriod(period);
    }

    onChangeBucket(delta) {

        this.props.changePriceChartBucket(delta);
    }

    render() {

        let {priceChartStatusLoader, buckets, currentBucket, priceChartCurrentPeriod} = this.props;
        let oneHour = 3600;

        let buttonPeriodValues = [{text: '6h', period: oneHour * 6}, {text: '2d', period: oneHour * 48}, {text: '4d', period: oneHour * 48 * 2}, {text: '1w', period: oneHour * 24 * 7}, {text: '2w', period: oneHour * 24 * 7 * 2}, {text: '1m', period: oneHour * 24 * 30}, {text: 'All', period: null} ];

        let periodButtons = buttonPeriodValues.map((btn) => {

            return (
                <button key={btn.period} onClick={this.onChangePeriod.bind(this, btn.period)} style={btn.period === priceChartCurrentPeriod ? {background: '#555', padding: '3px'} : {color: 'white',background: '#313659', padding: '3px'}} type="button">{btn.text}</button>
            );
        });




        let bucketButtons = buckets.filter(bucket => {
            return bucket > 60 * 4;
        }).map((delta) => {

            return (
                <button key={delta} onClick={this.onChangeBucket.bind(this, delta)} style={currentBucket === delta ? {background: '#555', padding: '3px'} : {color: 'white', background: '#313659', padding: '3px'}} type="button">{PeriodNameHelper.getPeriodNameByDeltaTime(delta)}</button>
            );
        });

        return (
            <div className="ex-chart ex-chart-01">
                <div className="section">
                    <div className="section__title">
                        PRICE CHART {periodButtons} | {bucketButtons} {priceChartStatusLoader === 'process' ? 'Process ...' : ''}
                    </div>
                    <div id="chart01" className="ex_chartStack"></div>
                </div>
            </div>
        )
    }
}

ExchangePriceChart = connect(
    (state) => {
        return {
            currentBucket: state.exchangePageReducer.currentBucket,
            highPriceList: state.exchangePageReducer.highPriceList,
            priceData: state.exchangePageReducer.priceData,
            priceChartCurrentPeriod: state.exchangePageReducer.priceChartCurrentPeriod,
            buckets: state.exchangePageReducer.buckets,
            priceChartStatusLoader: state.exchangePageReducer.priceChartStatusLoader

        };
    },
    {
        changePriceChartPeriod: ExchangePageActions.changePriceChartPeriod,
        changePriceChartBucket: ExchangePageActions.changePriceChartBucket

    }
)(ExchangePriceChart);

export default ExchangePriceChart;