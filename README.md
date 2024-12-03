# Gold Finance 
This Subgraph retrieves data from events emitted by Gold's Contracts deployed on Taiko Hekla Testnet.

- [Subgraph Endpoint](https://api.goldsky.com/api/public/project_cm3g5brjjwhmp01xo01sm8qy7/subgraphs/fluir-subgraph/1.0.0/gn)

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) 
- [Goldsky Account](https://app.goldsky.com/)

### Clone the repository
``` 
git clone https://github.com/ShivamAgarwal-code/Gold-Finance.git
cd Gold-Finance
```



 ### Install dependencies

```
npm install
```

#### CLI Installation

```bash
curl -fsSL https://cli.goldsky.com/install | bash
```

#### CLI Authentication

```bash

# Login to Goldsky and paste your API key when prompted
goldsky login
```

### 1. Deploying from Source code:

In the Subgraph project directory, run the following commands:

```bash
# Generate the subgraph code with graph cli
npm run prepare:taiko-hekla
graph codegen

# Build the subgraph
graph build

# Deploy the subgraph to Goldsky
goldsky subgraph deploy <subgraph name>/<version> --path .
```



