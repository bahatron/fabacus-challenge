# Fabacus Challenge

```sh
# start project
docker compose up --build

# run tests
docker exec fabacus-server sh -c "npm run test"
```

> **Navigate to localhost:3000/docs to see Swagger Documentation**

## Source Folder Structure

```
├── src/
│   ├── app/                Express configuration
│   ├── handlers/            Application logic, following Clean Architecture
│   ├── models/             DB and API schemas
│   ├── services/           Utility objects used across the application
|   ├── test/               Jest utilities and config files. The tests require a running environment to run
|   ├── index.ts            Application entry point
```

## File Naming Convention

- `*.route.ts` Will get auto-loaded as an endpoint as long as it's a valid `Route` type
- `*.test.ts` Will be picked up by Jest as test files

## Notes

- Since the challenge required only use REDIS I had to specify the event ID on the API interface so I could get access to the event's configuration like `MaxSeatsPerUser` and `ReservationDuration`
- The test suite is relying on a running environment, this is not the most common practice but I've personally prefer it since there's no need to add extra in memory and mocking setup 
- Hope you like it :)