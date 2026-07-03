
  # Design home page layout

  This is a code bundle for Design home page layout. The original project is available at https://www.figma.com/design/fL92850OsptVKQXEmDBOfG/Design-home-page-layout.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Local development / Backend integration

  ### Start the frontend

  ```powershell
  Copy-Item .env.example .env.local
  npm install
  npm run dev
  ```

  Vite serves the app at `http://localhost:5173`. The API base URL is read from
  `VITE_API_BASE_URL` in `.env.local` (defaults to the local backend at
  `http://localhost:8080/api/v1`).

  ### Backend requirements

  The shopping flow talks to the WearWhere Go backend (`backend-services`). For the
  integrated flows (auth/OTP, browse, wishlist, cart, checkout, orders, PayOS) the
  backend must be running with:

  ```text
  PostgreSQL and Redis running
  CORS_ALLOWED_ORIGINS includes the actual Vite origin (http://localhost:5173)
  PAYOS_RETURN_URL=http://localhost:5173/order/success
  PAYOS_CANCEL_URL=http://localhost:5173/cart
  ```

  Start the backend per its own README (`backend-services/README.md`): bring up
  Postgres + Redis, run migrations, then `make run` (listens on
  `http://localhost:8080`).
  