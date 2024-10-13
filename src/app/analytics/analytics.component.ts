import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AnalyticsService } from '../services/analytics.service';


interface GeneralStats {
    totalLikes: number;
    totalComments: number;
    numberOfCircleFriends: number;
    likesLastWeek: number;
    commentsLastWeek: number;
    friendsLastWeek: number;
}

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [ChartModule],
    templateUrl: './analytics.component.html',
    styleUrl: './analytics.component.scss'
})

export class AnalyticsComponent implements OnInit {
    data: any;
    options: any;

    data1: any;
    options1: any;

    data2: any;
    options2: any;

    generalStats: GeneralStats = {
        totalLikes: 0,
        totalComments: 0,
        numberOfCircleFriends: 0,
        likesLastWeek: 0,  
        commentsLastWeek: 0,
        friendsLastWeek: 0
    };

    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        this.getGeneralStats();
    }

    ngAfterViewInit(): void {
        this.initializeCharts();
    }

    getGeneralStats(): void {
        this.analyticsService.getGeneralStats().subscribe(
            (data) => {
                this.generalStats = data;
                console.log('General stats:', this.generalStats);
            },
            (error) => {
                console.error('Error fetching general stats:', error);
            }
        );
    }

    initializeCharts(): void {
        this.getCountryAudience();
        this.getAgeAudience();
        this.getGenderAudience();
    }

    getCountryAudience(): void {
        this.analyticsService.getCountryAudience().subscribe(
            (data) => {
                this.data = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Country of Audience',
                            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                            data: data.data
                        }
                    ]
                };
                this.options = this.getChartOptions();
                console.log(data);
            },
            (error) => {
                console.error('Error fetching country audience data:', error);
            }
        );
    }

    getAgeAudience(): void {
        this.analyticsService.getAgeAudience().subscribe(
            (data) => {
                this.data1 = {
                    labels: data.labels,
                    datasets: [
                        {
                            label: 'Age of Audience',
                            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                            data: data.data
                        }
                    ]
                };
                this.options1 = this.getChartOptions();
                console.log(data);
            },
            (error) => {
                console.error('Error fetching age audience data:', error);
            }
        );
    }

    getGenderAudience(): void {
        this.analyticsService.getGenderAudience().subscribe(
            (data) => {
                this.data2 = {
                    labels: data.labels,
                    datasets: [
                        {
                            data: data.data,
                            backgroundColor: [
                                getComputedStyle(document.documentElement).getPropertyValue('--blue-500'),
                                getComputedStyle(document.documentElement).getPropertyValue('--yellow-500'),
                                getComputedStyle(document.documentElement).getPropertyValue('--green-500')
                            ],
                            hoverBackgroundColor: [
                                getComputedStyle(document.documentElement).getPropertyValue('--blue-400'),
                                getComputedStyle(document.documentElement).getPropertyValue('--yellow-400'),
                                getComputedStyle(document.documentElement).getPropertyValue('--green-400')
                            ]
                        }
                    ]
                };
                this.options2 = {
                    cutout: '60%',
                    plugins: {
                        legend: {
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
                            }
                        }
                    }
                };
                console.log(data);
            },
            (error) => {
                console.error('Error fetching gender audience data:', error);
            }
        );
    }

    getChartOptions() {
        const documentStyle = getComputedStyle(document.documentElement);
        return {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: documentStyle.getPropertyValue('--text-color')
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: documentStyle.getPropertyValue('--text-color-secondary'),
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        color: documentStyle.getPropertyValue('--surface-border'),
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: documentStyle.getPropertyValue('--text-color-secondary')
                    },
                    grid: {
                        color: documentStyle.getPropertyValue('--surface-border'),
                        drawBorder: false
                    }
                }
            }
        };
    }
}

