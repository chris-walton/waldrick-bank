import { Component, inject, input, resource } from '@angular/core';
import {
    type AxisModel,
    type IAxisLabelRenderEventArgs,
    ChartModule,
    DateTimeService,
    LineSeriesService,
    StockChartModule,
    StripLineService,
} from '@syncfusion/ej2-angular-charts';
import { BankingDataService } from '../../services';

@Component({
    standalone: true,
    selector: 'app-line-chart',
    host: { ngSkipHydration: 'true' },
    template: `<ejs-stockchart [title]='chartTitle()' [primaryXAxis]='primaryXAxis' [indicatorType]="[]" [exportType]="[]" (axisLabelRender)="onAxisLabelRender($event)">
            <e-stockchart-series-collection>
                <e-stockchart-series [dataSource]='data.value()' type='Line' xName='date' yName='amount' width=2 />
            </e-stockchart-series-collection>
        </ejs-stockchart>`,
    imports: [ChartModule, StockChartModule],
    providers: [DateTimeService, LineSeriesService, StripLineService]
})
export class LineChartComponent {
    private readonly dataService = inject(BankingDataService);

    readonly accountId = input.required<string>();
    readonly chartTitle = input.required<string>();
    readonly primaryXAxis: AxisModel = {
        valueType: 'DateTime',
        intervalType: 'Days',
        labelFormat: 'dd/MM/yy'
    }

    readonly data = resource({
        request: () => [this.accountId()],
        loader: async ({ request }) => this.getChartDataAsync(request[0]),
    });

    onAxisLabelRender(args: IAxisLabelRenderEventArgs): void {
        if (args.axis.name === 'primaryYAxis') {
            args.text = Number.parseFloat(args.text).toLocaleString();
        }
    }

    private async getChartDataAsync(accountId: string): Promise<unknown[]> {
        const records = await this.dataService.getHistoricRecords(accountId);

        console.log(records.map(record => ({
            date: new Date(record.id),
            amount: record.amount,
        })));
        return records.map(record => ({
            date: new Date(record.id),
            amount: record.amount,
        }));
    }
}
