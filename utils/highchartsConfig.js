import Highcharts from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";

// Config for highcharts accessibility
Accessibility(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);

export default Highcharts;
