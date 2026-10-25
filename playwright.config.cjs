const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({testDir:'./tests',fullyParallel:false,workers:1,outputDir:'.runtime/test-results',reporter:'list',use:{baseURL:'http://127.0.0.1:4195',headless:true},webServer:{command:'npm run dev -- --port 4195 --strictPort',url:'http://127.0.0.1:4195',reuseExistingServer:false}});
