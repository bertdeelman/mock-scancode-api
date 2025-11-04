# Mock ScanCode Validation API

Simpele mock API die een ScanCode valideert voor eManager (Element Logic / AutoStore integratie).

De API doet één ding:

| Situatie | HTTP status | Body |
|----------|-------------|------|
| ScanCode is geldig | **204 No Content** | *(geen body)* |
| ScanCode is ongeldig | **200 OK** | `{"Message":"Invalid ScanCode","Code":"999"}` |

Dit gedrag is nodig omdat eManager:
- validatie bepaalt op basis van HTTP status
- én bij een `200` de body controleert met een regex

---

## Endpoint

```
GET/POST:
 /api/v1/extproductids/{ExtProductId}/serials/{ScanCode}/owners/{OwnerCode}/extpicklistids/{ExtPicklistId}/extpicklistlineids/{ExtPicklistLineId}
```

---

## Configureerbare validatie

Je kunt scancodes op twee manieren configureren:

### 1. Via environment variable (**aanbevolen, Render-friendly**)

```
VALID_SCANCODES=ABC12,A123,XYZ
```

### 2. Via JSON-bestand (fallback / lokale ontwikkeling)

`valid-scancodes.json`:

```json
["ABC12", "A123", "XYZ"]
```

---

## Start lokaal

```sh
npm install
npm start
```

Test:

```
curl -i "http://localhost:3000/api/v1/extproductids/1/serials/ABC12/owners/O1/extpicklistids/1/extpicklistlineids/1"
```

---

## Deploy naar Render (1 klik)

Klik op de knop hieronder om deze service te deployen naar Render:

[Deploy to Render](https://render.com/deploy?repo=https://github.com/bertdeelman/mock-scancode-api)

---

## Project structuur

```
mock-scancode-api/
│ server.js
│ package.json
│ valid-scancodes.json   (optioneel, fallback)
```

---

## server.js gedrag

Valid ScanCode (match):

```
HTTP/1.1 204 No Content
```

Invalid ScanCode (no match):

```
HTTP/1.1 200 OK
{"Message":"Invalid ScanCode","Code":"999"}
```

Dit formaat is exact wat eManager verwacht i.c.m. `errorRegex`.

---

## Waarom geen HTTP 400 / 404 bij invalid?

Omdat eManager **alleen bij HTTP 200** de body controleert.

- HTTP ≠ 200 → valid (geen foutmelding)
- HTTP = 200 → regex check → invalid

Daarom moet invalid **200** teruggeven.

---

## License

MIT
