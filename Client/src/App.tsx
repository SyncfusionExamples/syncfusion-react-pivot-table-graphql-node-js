import * as React from 'react';
import { PivotViewComponent, CellEditSettings, Inject, FieldList } from '@syncfusion/ej2-react-pivotview';
import { DataManager, GraphQLAdaptor } from '@syncfusion/ej2-data';
import type { DataSourceSettingsModel } from '@syncfusion/ej2-pivotview/src/model/datasourcesettings-model';
import type { BeginDrillThroughEventArgs } from '@syncfusion/ej2-pivotview';
import './App.css';

function App(): React.ReactElement {

  const data = new DataManager({
    url: 'http://localhost:4205',
    adaptor: new GraphQLAdaptor({
      response: {
        result: 'getProducts.result',
        count: 'getProducts.count'
      },
      query: `
            query getProducts($datamanager: DataManagerInput) {
              getProducts(datamanager: $datamanager) {
                count
                result {
                  ProductID
                  ProductName
                  Category
                  MRP
                  Discount
                }
              }
            }
          `,
      getMutation: function (action: any): string {
        if (action === 'insert') {
          return `mutation CreateProductMutation($value: ProductInput!) {
                createProduct(value: $value) {
                  ProductID
                  ProductName
                  Category
                  MRP
                  Discount
                }
              }`;
        }
        if (action === 'update') {
          return `mutation UpdateProductMutation($key: String!, $keyColumn: String, $value: ProductInput!) {
                updateProduct(key: $key, keyColumn: $keyColumn, value: $value) {
                  ProductID
                  ProductName
                  Category
                  MRP
                  Discount
                }
              }`;
        }
        else {
          // Use this in your getMutation helper
          return `mutation RemoveProductMutation($key: String!, $keyColumn: String) {
              deleteProduct(key: $key, keyColumn: $keyColumn) {
                  ProductID
                  ProductName
                  Category
                  MRP
                  Discount 
              }
            }`;
        }
      }
    }),
    crossDomain: true,
  });

  const dataSourceSettings: DataSourceSettingsModel = {
    dataSource: data,
    expandAll: false,
    rows: [
      { name: 'ProductID' }
    ],
    columns: [
      { name: 'ProductName' }
    ],
    values: [
      { name: 'MRP' }
    ],
    formatSettings: [
      { name: 'MRP', format: 'C0' },
    ]
  };

  // Enable editing functionality
  const editSettings: CellEditSettings = {
    allowEditing: true,    // Enables the Edit button and allows users to modify existing records.
    allowAdding: true,     // Enables the Add button and allows users to create new records.
    allowDeleting: true,   // Enables the Delete button and allows users to remove records.
    mode: 'Normal'         // Uses Normal mode (popup dialog) for editing; other options: 'Dialog', 'Batch', 'CommandColumn'.
  };


  const pivotObj = React.useRef<PivotViewComponent>(null);

  // Configure beginDrillThrough event to set the primary key for CRUD operations
  function beginDrillThrough(args: BeginDrillThroughEventArgs) {
    // Iterate through all columns in the drill-through grid
    for (var i = 0; i < args.gridObj.columns.length; i++) {
      // Check if the current column is the primary key column
      if (args.gridObj.columns[i].field === "ProductID") {
        // Mark this column as the primary key
        // This tells DataManager to use this column's value to uniquely identify records
        args.gridObj.columns[i].isPrimaryKey = true;
        args.gridObj.columns[i].editType = 'stringedit';
      } else {
        // Make all other columns visible so users can view and edit them
        args.gridObj.columns[i].visible = true;
      }
    }
  }

  return (
    <div className='control-section' style={{ margin: 100 }}>
      <PivotViewComponent ref={pivotObj} id='PivotView' height={350} width={700} showFieldList={true} dataSourceSettings={dataSourceSettings} editSettings={editSettings} beginDrillThrough={beginDrillThrough}>
        <Inject services={[FieldList]} />
      </PivotViewComponent>
    </div>
  );
}

export default App;