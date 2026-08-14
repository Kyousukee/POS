# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server. Note: bound to `--host=192.168.1.2` (LAN IP hardcoded in package.json). If that IP isn't the machine's, use `npx ng serve` instead.
- `npm run build` — production build (defaultConfiguration is `production`) into `dist/pos`.
- `npm run watch` — development build in watch mode.
- `npm test` — Karma/Jasmine in Chrome. Single spec: `npx ng test --include=src/app/components/pages/stock-productos/stock-productos.component.spec.ts`. There is no `karma.conf.js` and no `src/test.ts` — the `@angular/build:karma` builder supplies both. If Chrome isn't installed, point `CHROME_BIN` at Edge and run `npx ng test --watch=false --browsers=ChromeHeadless`.
- Deploy: `angular-cli-ghpages` is a devDependency (gh-pages publishing of `dist/pos`). `outputPath.browser` is set to `""` in `angular.json` so the build lands directly in `dist/pos` rather than the builder's default `dist/pos/browser`.

Angular 22 with NgModules (no standalone components / signals — the v19 migration marked every component `standalone: false`). Templates use block control flow (`@if` / `@for`), not `*ngIf` / `*ngFor`. TypeScript strict mode is on (`tsconfig.json`), so new code must satisfy strict null checks. `tsconfig.json` has no `baseUrl` (deprecated in TS 6); absolute `src/...` imports work via the `paths` mapping instead.

## Architecture

Angular 22 + Angular Material POS (point-of-sale) front-end for a .NET backend. UI text, identifiers, and folder names are in Spanish — keep that convention.

**Backend.** All HTTP goes to `GlobalConstants.apiURL` (`src/app/components/reusable/global-constants.ts`), currently the public `https://posapi.somee.com`. To point at a local API, swap the commented `localhost` line there — the `environment.ts` files are unused stubs and carry no API config. `proxy.conf.json` proxies `/api/*` and only applies if a service is switched back to the commented relative `apiBase` form (several services keep both lines).

**API contract.** Every endpoint returns `ResponseApi` (`{status, msg, value: any}`). Callers check `data.status` and read the untyped `value`; there is no interceptor and no central error handling — each component handles `next`/`error` inline, usually surfacing errors via `MatSnackBar`.

**Auth / session.** No guards, no interceptor, no token. Login (`components/login`) calls `Usuarios/IniciarSesion` and stores the whole `Usuario` object in `sessionStorage` under key `session`. Services read that same key in their constructor into `UsuarioLogueado` and inject `idLocal` into query strings — meaning a service instantiated before login has a stale/undefined user. `PagesComponent.ngOnInit` is the only access check (redirects to `login` when `session` is missing); it also unconditionally redirects to `pages/dashboard`, so deep links into `/pages/*` bounce to the dashboard.

**Authorization** is presentation-only, hardcoded in `NavigationComponent`'s constructor as a matrix of `idRol` (1/2/3) × `idtipolocal` (1/2) toggling `Permiso*` booleans that hide sidenav links. Routes themselves stay reachable. Adding a page means adding a matching `Permiso*` flag and updating every branch of that matrix.

**Module layout.**
- `AppModule` + `app-routing.module.ts`: `login`, lazy `pages`, `**` → not-found.
- `PagesModule` (lazy) declares every page and every dialog; `pages-routing.module.ts` nests pages under `PagesComponent`.
- `ReusableModule` is the shared barrel — it imports/exports all Angular Material modules plus `FormsModule` and `ReactiveFormsModule`. Import it rather than adding Material imports per-module. `HttpClient` is *not* exported here: it is provided once at the root via `provideHttpClient()` in `AppModule`.

**Feature pages** live in `components/pages/<feature>/`; modals in `components/pages/modals/dialog-*` and are opened with `MatDialog`, returning results the parent page uses to refresh its `MatTableDataSource`. Services in `src/app/servicios/` are one-per-domain (`ventas`, `compras`, `productos`, `proveedor`, `reportes`, `dashboard`, `usuario`, `categorias`, `rol`, `local`, `por-cobrar`), each a thin `HttpClient` wrapper over `${apiBase}Guardar|Editar|Eliminar|Historial|Reporte`. Interfaces in `src/app/interfaces/` mirror backend DTOs.

`xlsx` is used for report export, `chart.js` for the dashboard, `moment` + `MomentDateModule` for date range pickers.

**Dead code to leave alone unless asked:** `components/pages/historial-compra--no se ocupa/` (name literally means "not used"; its route is commented out but the component is still declared) and the empty `components/login/guide/router` directory.

`BD/TablasBD.sql` holds the backend schema for reference.
