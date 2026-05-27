# Bible API Documentation

Base URL: `https://your-server.com`
|**Endpoint**|
|----|
|{base_url}/book|
|{base_url}/verse|

## Endpoints

### 1. Get All Books

Mengambil seluruh daftar kitab beserta jumlah chapter masing-masing.

```
GET: /book
```

**Request**

Tidak memerlukan parameter apapun.

**Response `200 OK`**

```json
{
  "books": [
    {
      "id": 1,
      "bnumber": 1,
      "name": "Kejadian",
      "_count": {
        "chapters": 50
      }
    },
    {
      "id": 2,
      "bnumber": 2,
      "name": "Keluaran",
      "_count": {
        "chapters": 40
      }
    }
  ]
}
```

**Response `500 Internal Server Error`**

```json
{
  "message": "Internal server error"
}
```

---

### 2. Get Book by Name

Mengambil detail satu kitab beserta daftar chapter-nya.

```
GET /book/:book
```

**Path Parameter**

| Parameter | Format                                              | Contoh                                |
| --------- | --------------------------------------------------- | ------------------------------------- |
| `book`    | Nama kitab dalam lowercase, kata dipisah dengan `-` | `kejadian`, `1-raja-raja`, `1-samuel` |

**Request Example**

```
GET /1-raja-raja
GET /matius
GET /1-samuel
```

**Response `200 OK`**

```json
{
  "id": 11,
  "name": "1 Raja-Raja",
  "chapters": [
    {
      "id": 1,
      "bibleBook": "1 Raja-Raja 1"
    },
    {
      "id": 2,
      "bibleBook": "1 Raja-Raja 2"
    }
  ]
}
```

**Response `400 Bad Request`**

Terjadi jika parameter mengandung karakter selain huruf, angka, dan `-`.

```json
{
  "message": "Invalid book parameter"
}
```

**Response `404 Not Found`**

```json
{
  "message": "Book not found"
}
```

**Response `500 Internal Server Error`**

```json
{
  "message": "Internal server error"
}
```

---

### 3. Get All Verses by Chapter

Mengambil seluruh ayat dari satu chapter dalam satu kitab.

```
GET /verse/:book/:chapter
```

**Path Parameters**

| Parameter | Format                            | Contoh               |
| --------- | --------------------------------- | -------------------- |
| `book`    | Nama kitab, huruf pertama kapital | `Kejadian`, `Matius` |
| `chapter` | Nomor chapter (integer)           | `1`, `22`            |

**Request Example**

```
GET /kejadian/1
GET /matius/5
GET /1-raja-raja/3
```

**Response `200 OK`**

```json
{
  "book": "Kejadian",
  "chapter": 1,
  "verses": [
    {
      "number": 1,
      "content": "Pada mulanya Allah menciptakan langit dan bumi."
    },
    {
      "number": 2,
      "content": "Bumi belum berbentuk dan kosong..."
    }
  ]
}
```

**Response `400 Bad Request`**

Terjadi jika parameter `chapter` bukan angka.

```json
{
  "message": "Invalid chapter number"
}
```

**Response `404 Not Found`**

```json
{
  "message": "Chapter not found"
}
```

**Response `500 Internal Server Error`**

```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

API ini menerapkan rate limiting berbasis IP.

| Limit       | Window      |
| ----------- | ----------- |
| 60 requests | per 1 menit |

Jika limit terlampaui, server akan merespons dengan:

**Response `429 Too Many Requests`**

```json
{
  "message": "Too many requests, please try again later."
}
```

Header rate limit tersedia di setiap response:

```
RateLimit-Limit: 60
RateLimit-Remaining: 45
RateLimit-Reset: 1700000000
```

---

## Error Reference

| Status Code | Keterangan            |
| ----------- | --------------------- |
| `400`       | Parameter tidak valid |
| `404`       | Data tidak ditemukan  |
| `429`       | Rate limit terlampaui |
| `500`       | Internal server error |
# Bible_API
