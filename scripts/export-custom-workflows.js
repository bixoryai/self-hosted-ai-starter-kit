#!/usr/bin/env node

// Auto-export script for n8n workflows and credentials
// Exports all non-demo workflows to /custom directory

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const N8N_BASE_URL = 'http://localhost:5678';
const CUSTOM_WORKFLOWS_DIR = './n8n/custom/workflows';
const CUSTOM_CREDENTIALS_DIR = './n8n/custom/credentials';

// Demo workflow IDs to exclude
const DEMO_WORKFLOW_IDS = ['srOnR8PAY3u4RSwb'];
const DEMO_CREDENTIAL_IDS = ['sFfERYppMeBnFNeA', 'xHuYe0MDGOs9IpBW'];

async function exportWorkflows() {
  try {
    // Get all workflows
    const workflowsResponse = await axios.get(`${N8N_BASE_URL}/api/v1/workflows`);
    const workflows = workflowsResponse.data.data;

    // Filter out demo workflows
    const customWorkflows = workflows.filter(w => !DEMO_WORKFLOW_IDS.includes(w.id));

    for (const workflow of customWorkflows) {
      // Get full workflow details
      const fullWorkflow = await axios.get(`${N8N_BASE_URL}/api/v1/workflows/${workflow.id}`);
      const workflowData = fullWorkflow.data.data;

      // Clean up for export (remove unnecessary fields)
      delete workflowData.versionId;
      delete workflowData.updatedAt;
      
      // Save to file
      const filename = `${workflow.id}.json`;
      const filepath = path.join(CUSTOM_WORKFLOWS_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
      console.log(`Exported workflow: ${workflow.name} -> ${filename}`);
    }

  } catch (error) {
    console.error('Failed to export workflows:', error.message);
  }
}

async function exportCredentials() {
  try {
    // Get all credentials (requires admin access)
    const credentialsResponse = await axios.get(`${N8N_BASE_URL}/api/v1/credentials`);
    const credentials = credentialsResponse.data.data;

    // Filter out demo credentials
    const customCredentials = credentials.filter(c => !DEMO_CREDENTIAL_IDS.includes(c.id));

    for (const credential of customCredentials) {
      // Get full credential details
      const fullCredential = await axios.get(`${N8N_BASE_URL}/api/v1/credentials/${credential.id}`);
      const credentialData = fullCredential.data.data;

      // Save to file
      const filename = `${credential.id}.json`;
      const filepath = path.join(CUSTOM_CREDENTIALS_DIR, filename);
      
      fs.writeFileSync(filepath, JSON.stringify(credentialData, null, 2));
      console.log(`Exported credential: ${credential.name} -> ${filename}`);
    }

  } catch (error) {
    console.error('Failed to export credentials:', error.message);
  }
}

// Ensure directories exist
fs.mkdirSync(CUSTOM_WORKFLOWS_DIR, { recursive: true });
fs.mkdirSync(CUSTOM_CREDENTIALS_DIR, { recursive: true });

// Run exports
console.log('Starting n8n export...');
exportWorkflows().then(() => exportCredentials()).then(() => {
  console.log('Export completed!');
});
