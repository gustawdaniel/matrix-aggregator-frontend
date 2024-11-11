# Nuxt Minimal Starter

```
npx nuxi@latest init .
```

## Crawl

https://www.firecrawl.dev/app/settings

## API

Add tag

```bash
echo '{"name": "test", "color": "#000000"}' | http POST localhost:3000/api/tags
```

Get tags

```bash
http localhost:3000/api/tags
```

Delete tag

```bash
http DELETE localhost:3000/api/tags/6731e8e6f915b84eae58a829
```

Tag articles

```bash
echo '{"significance": 1}' | http POST localhost:3000/api/article/6731c8c55225137f386dfbb5/tags/6731e9adf915b84eae58a82f
```

Remove tag from article

```bash
http DELETE localhost:3000/api/article/6731c8c55225137f386dfbb5/tags/6731e9adf915b84eae58a82f
```

update tags

```bash
echo '[{"tag_id": "6731e9adf915b84eae58a82f", "significance": 0.1}]' | http PUT localhost:3000/api/article/6731c8c55225137f386dfbb5/tags
```