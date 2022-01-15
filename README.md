#### Cloudflare Worker as Key Server for Federated Time-Lock Encryption Scheme

1. Create `wrangler.toml` file and fill the required information:

    ```toml
    name = "time-lock-key-server"
    type = "javascript"
    zone_id = ""
    account_id = "" # paste from cloudflare dashboard
    route = ""
    workers_dev = true
    compatibility_date = "2022-01-15"

    [[kv_namespaces]]
    binding = "TIME_LOCK_KV"
    id = "" # paste kv namespace id from dashboard
    preview_id = "" # for wrangler dev & wrangler preview

    [build]
    command = "npm install && npm run build"
    [build.upload]
    format = "service-worker"
    ```
2. Run:

    ```bash
    wrangler login
    wrangler dev
    ```
