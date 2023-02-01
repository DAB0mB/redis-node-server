# Redis Node Server

This is a Redis implementation in pure Javascript that was built with readabiliy and extensibility in mind. It offers the following:

- Data storage
- Data expiry and garbage collection
- Data persistency with automatic backups
- Message brokerage

By default, it will run on port `3478`, and you can connect to it with a native Redis client:

```sh
redis.cli -p 3478
```

Supported commands follow the original Redis specs, but they are limited:

- [command](./src/commands/commands/command.ts)
- [command|docs](./src/commands/commands/command_docs.ts)
- [del](./src/commands/commands/del.ts)
- [expire](./src/commands/commands/expire.ts)
- [get](./src/commands/commands/get.ts)
- [persist](./src/commands/commands/persist.ts)
- [publish](./src/commands/commands/publish.ts)
- [save](./src/commands/commands/save.ts)
- [set](./src/commands/commands/set.ts)
- [subscribe](./src/commands/commands/subscribe.ts)
- [ttl](./src/commands/commands/ttl.ts)
- [unsubscribe](./src/commands/commands/unsubscribe.ts)

Adding new commands is easy, all you have to do is implement the [Command](./src/commands/command.ts) interface.

The presented persistency mechanism is inspired by the original one, although it's slightly different. It's designed to be simpler and "just work" right out of the gate:

- It utilizes a mixed approach that's similar to [RDB](https://redis.io/docs/management/persistence/#rdb-advantages) + [AOF](https://redis.io/docs/management/persistence/#aof-advantages).
- Data and activity are recorded into a much friendlier file format called [JSON-Lines](https://jsonlines.org/).
- Automatic backups are ran every fixed interval.
- Each time the data is saved, the activity log will be cleared, thus preventing it from getting infinitly big.
- The datastore will be recovered on every startup.

The persistency behavior can be modified via environment variables, amongst other things:

- **PORT** - Defaults to `6378`.
- **HOST** - Defaults to `0.0.0.0`.
- **ACTIVITY_FILE** - Defaults to `/data/activity.jsonl`.
- **DATA_FILE** - Defaults to `/data/data.jsonl`.
- **DATA_RECORD_INTERVAL** - Defaults to `60` seconds.

To start the server you can run `npm start`, or you can run a Docker container:

```sh
docker run \
  -p 6378:6378 \
  -v "$(pwd)"/data:/data \
  --name redis-node-server \
  redis-node-server
```
