# Syncfusion React Pivot Table – Node.js GraphQL Backend Quick Start

A quick start project that demonstrates how to bind remote data from a GraphQL service to the Syncfusion React Pivot Table using the GraphQLAdaptor with a Node.js GraphQL backend.

This sample shows the full data flow between a React client, the Syncfusion DataManager, the GraphQLAdaptor, and a lightweight GraphQL server implemented with Graphpack and TypeScript. The backend serves an in-memory product dataset and exposes both query and mutation operations so the Pivot Table can retrieve summarized data and perform CRUD actions through the drill-through editing experience.

---

## 📑 Table of Contents

- [🚀 Quick Overview](#-quick-overview)
- [✨ Key Features](#-key-features)
- [🧱 Architecture](#-architecture)
- [🛠️ Prerequisites](#-prerequisites)
- [📂 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#-installation--setup)
- [▶️ Running the Application](#-running-the-application)
- [🔄 Data Flow and GraphQL Integration](#-data-flow-and-graphql-integration)
- [🧪 CRUD Operations](#-crud-operations)
- [🔧 Troubleshooting](#-troubleshooting)
- [📖 Additional Resources](#-additional-resources)

---

## 🚀 Quick Overview

This sample connects the Syncfusion React Pivot Table to a Node.js GraphQL backend using the GraphQLAdaptor. The client sends GraphQL queries to fetch records, while the server returns the data in the response shape expected by the Pivot Table. The same integration also supports create, update, and delete operations through GraphQL mutations.

| Component | Technology | Purpose |
| --- | --- | --- |
| Frontend | React + Vite + Syncfusion Pivot Table | Renders the Pivot Table UI and handles editing workflows |
| Backend | Node.js + Graphpack + TypeScript | Hosts the GraphQL endpoint and resolves query/mutation requests |
| Adaptor | GraphQLAdaptor | Maps GraphQL responses and sends GraphQL mutations for CRUD |
| Data Source | In-memory TypeScript array | Provides sample product data for the demo |

> 💡 The current implementation uses a simple in-memory dataset rather than a database. This keeps the sample easy to run locally while still demonstrating the GraphQL integration pattern.

---

## ✨ Key Features

- 📊 Remote data binding from a GraphQL endpoint to the Syncfusion React Pivot Table
- 🔄 CRUD support through GraphQL mutations for insert, update, and delete
- 🧩 Schema-based GraphQL integration with strongly typed TypeScript resolvers
- 📦 Lightweight backend setup using Graphpack and TypeScript
- 🧠 Custom request and response mapping for the Pivot Table data contract
- 🛠️ Drill-through editing support with ProductID as the primary key
- ⚡ Minimal setup for local development with no database required

---

## 🧱 Architecture

The sample is composed of two main parts:

1. A React client that renders the Pivot Table and configures the DataManager with the GraphQLAdaptor.
2. A GraphQL backend that exposes a query and several mutations for retrieving and modifying product records.

### Client-side flow

The React application creates a DataManager that points to the GraphQL server endpoint. The DataManager uses GraphQLAdaptor to:

- send a GraphQL query for data retrieval,
- map the response fields into the Pivot Table’s expected structure,
- execute GraphQL mutations for create, update, and delete operations initiated from the editing UI.

### Server-side flow

The Node.js backend exposes the GraphQL schema defined in [GraphQLAdaptor/src/schema.graphql](GraphQLAdaptor/src/schema.graphql). The resolver implementation in [GraphQLAdaptor/src/resolvers.ts](GraphQLAdaptor/src/resolvers.ts) reads from the in-memory product list in [GraphQLAdaptor/src/data.ts](GraphQLAdaptor/src/data.ts) and returns the data in the shape expected by the client.

---

## 🛠️ Prerequisites

Make sure the following tools are installed before running the sample:

| Software / Package | Recommended version | Purpose |
| --- | --- | --- |
| Node.js | 20.x or later | Runs the GraphQL server and the React client |
| npm | 10.x or later | Installs dependencies and runs scripts |
| Vite | 8.x or later | Serves the React frontend |
| Syncfusion Pivot Table packages | Latest compatible version | Provides the Pivot Table and GraphQLAdaptor support |

---

## 📂 Project Structure

```text
react-pivot-table-graphql-nextjs/
├── Client/                         # Vite-based React application
│   ├── src/
│   │   ├── App.tsx                 # Pivot Table setup and GraphQLAdaptor configuration
│   │   └── main.tsx
│   └── package.json
├── GraphQLAdaptor/                 # GraphQL backend source
│   ├── src/
│   │   ├── data.ts                 # In-memory sample product data
│   │   ├── resolvers.ts           # GraphQL query and mutation resolvers
│   │   ├── schema.graphql         # GraphQL schema definition
│   │   └── types.ts               # TypeScript interfaces for mutation inputs/args
│   └── package.json
├── README.md
└── graphql-nodejs-server.md       # User Guide reference used for this sample
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd react-pivot-table-graphql-nextjs
```

### 2. Install backend dependencies

The GraphQL server is defined under [GraphQLAdaptor](GraphQLAdaptor).

```bash
cd GraphQLAdaptor
npm install
```

This installs Graphpack, which is used to run the GraphQL server in development mode.

### 3. Install frontend dependencies

The React client is defined under [Client](Client).

```bash
cd ../Client
npm install
```

---

## ▶️ Running the Application

You need two terminals: one for the GraphQL backend and one for the React client.

### Terminal 1 – Start the GraphQL backend

```bash
cd GraphQLAdaptor
npm run dev
```

The GraphQL server starts on port 4205 and exposes the GraphQL endpoint at:

```text
http://localhost:4205/
```

### Terminal 2 – Start the React client

```bash
cd Client
npm run dev
```

Vite typically serves the application at:

```text
http://localhost:5173/
```

Once both applications are running, the Pivot Table loads data from the GraphQL endpoint and renders the report layout defined in the client component.

---

## 🔄 Data Flow and GraphQL Integration

### GraphQL schema

The GraphQL schema in [GraphQLAdaptor/src/schema.graphql](GraphQLAdaptor/src/schema.graphql) defines:

- a Product type with ProductID, ProductName, Category, MRP, and Discount,
- a ReturnType that contains result and count,
- a Query named getProducts,
- input types and mutations for create, update, and delete.

```graphql
type Product {
  ProductID: String!
  ProductName: String
  Category: String
  MRP: Float
  Discount: Float
}

type ReturnType {
  result: [Product!]!
  count: Int!
}

type Query {
  getProducts(datamanager: DataManagerInput): ReturnType!
}
```

### Resolver implementation

The resolver functions in [GraphQLAdaptor/src/resolvers.ts](GraphQLAdaptor/src/resolvers.ts) handle the request logic:

- getProducts returns the in-memory product list and the total number of records.
- createProduct appends a new product to the in-memory array.
- updateProduct finds the matching record by ProductID and merges the incoming values.
- deleteProduct removes the matching record from the array.

```ts
const resolvers = {
  Query: {
    getProducts: () => {
      const result = [...productDetails];
      const count = result.length;
      return { result, count };
    },
  },
  Mutation: {
    createProduct: (_parent, { value }) => {
      productDetails.push(value);
      return value;
    },
  },
};
```

### Data source

The sample data is stored in [GraphQLAdaptor/src/data.ts](GraphQLAdaptor/src/data.ts) as an in-memory array of product objects. There is no database layer in this sample, so all CRUD operations affect the runtime array only.

---

## 🔄 GraphQLAdaptor Configuration

The client-side integration is configured in [Client/src/App.tsx](Client/src/App.tsx). The DataManager uses the GraphQLAdaptor with the following responsibilities:

- defining the GraphQL query for initial data retrieval,
- mapping the response fields from the GraphQL payload to the Pivot Table,
- generating GraphQL mutations for editing actions.

### Response mapping

The adaptor is configured to read the response payload from:

```ts
response: {
  result: 'getProducts.result',
  count: 'getProducts.count'
}
```

This tells the adaptor to read the array of records from the GraphQL response’s getProducts.result field and the total row count from getProducts.count.

### Query definition

The GraphQL query used by the adaptor requests the fields required by the Pivot Table:

```ts
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
`
```

### Mutation generation

The sample uses a custom getMutation handler to generate the GraphQL mutation for insert, update, and delete operations:

```ts
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
```

---

## 🧪 CRUD Operations

The Pivot Table editing experience is enabled with the following settings in [Client/src/App.tsx](Client/src/App.tsx):

- allowEditing: true
- allowAdding: true
- allowDeleting: true
- mode: 'Normal'

The sample also configures the drill-through grid so that ProductID is treated as the primary key. This allows the adaptor to send the correct key information for update and delete operations.

### What happens during CRUD

- Insert: the client sends a createProduct mutation with a ProductInput payload.
- Update: the client sends an updateProduct mutation using the ProductID as the lookup key.
- Delete: the client sends a deleteProduct mutation using ProductID to identify the record.

The backend resolver logic updates the in-memory array accordingly and returns the modified record to the client.

---

## 📊 Pivot Table Configuration

The Pivot Table is configured with the following report layout:

- rows: ProductID
- columns: ProductName
- values: MRP
- format settings: currency formatting for MRP

This layout is defined in the dataSourceSettings object in [Client/src/App.tsx](Client/src/App.tsx) and is suitable for demonstrating server-side data retrieval and aggregation behavior through the Pivot Table UI.

---

## 🔧 Troubleshooting

| Issue | Possible cause | Resolution |
| --- | --- | --- |
| The Pivot Table does not load data | The GraphQL backend is not running or the endpoint URL is incorrect | Start the GraphQL server and verify that the client points to http://localhost:4205 |
| GraphQL errors appear in the browser console | The query or mutation shape does not match the schema | Review the schema in [GraphQLAdaptor/src/schema.graphql](GraphQLAdaptor/src/schema.graphql) and the adaptor query/mutation definitions in [Client/src/App.tsx](Client/src/App.tsx) |
| CRUD actions do not update the table | ProductID is not being treated as the primary key in the drill-through grid | Confirm that the beginDrillThrough handler marks ProductID as the primary key |
| The server fails to start | Missing dependencies or an incompatible Node.js environment | Run npm install in both the GraphQLAdaptor and Client folders and use a current Node.js version |

> ℹ️ This sample is intentionally simple. It does not include authentication, persistence to a database, or production deployment configuration.

---

## 📖 Additional Resources

- Syncfusion React Pivot Table documentation
- Syncfusion GraphQLAdaptor documentation
- GraphQL official documentation
- The accompanying reference document [graphql-nodejs-server.md](graphql-nodejs-server.md)

---

## 🤝 Contributing

Contributions are welcome and appreciated! 💖

1. 🍴 **Fork** the repository.
2. 🌿 **Create** a feature branch: `git checkout -b feature/my-awesome-change`
3. 💾 **Commit** your changes: `git commit -m "Add my awesome change"`
4. 📤 **Push** to your branch: `git push origin feature/my-awesome-change`
5. 🔁 **Open** a Pull Request describing the change and its motivation.

### 📋 Contribution Guidelines

- Follow the existing code style in both the React and ASP.NET Core projects.
- Keep changes focused — one feature or fix per pull request.
- Update or add documentation (`README.md`, `webapi-adaptor.md`) when behavior changes.
- Test your changes locally against both the backend and frontend before submitting.

---

## 📜 License & Support

### 📄 License

This project is released under the **MIT License**. You are free to use, modify, and distribute the code in personal and commercial projects. See the [LICENSE](LICENSE) file for full text.

### 🛟 Support

- 📘 **Documentation:** [Syncfusion® React Pivot Table Docs](https://ej2.syncfusion.com/react/documentation/pivotview/getting-started)
- 💬 **Community forum:** [Syncfusion® Community](https://www.syncfusion.com/forums)
- 🐛 **Bug reports & feature requests:** [GitHub Issues](https://github.com/SyncfusionExamples/webapi-adaptor-with-pivot-table/issues)
- 📧 **Direct support:** [Syncfusion® Support Portal](https://www.syncfusion.com/support) (for licensed users)
- 📖 **Web API Adaptor Guide:** [WebApiAdaptor Documentation](https://ej2.syncfusion.com/react/documentation/data/adaptors/webapi-adaptor)

> ⭐ If this project helped you, please consider giving it a **star** on GitHub — it helps others discover it!

---

## ✅ Summary

This sample demonstrates a practical way to connect Syncfusion React Pivot Table to a Node.js GraphQL backend using GraphQLAdaptor. It shows how to:

- fetch data through GraphQL queries,
- map GraphQL response fields to the Pivot Table,
- execute GraphQL mutations for CRUD operations,
- and keep the implementation lightweight with in-memory data and TypeScript-based resolvers.
