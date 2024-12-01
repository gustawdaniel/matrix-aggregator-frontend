# Nuxt Minimal Starter

```
npx nuxi@latest init .
```

## Crawl

https://www.firecrawl.dev/app/settings

## MongoDB

> gustaw.daniel+aic@gmail.com

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

http://167.71.52.205:3400/


v1 ( helpful assistant )

"Russia conducted its largest missile strike on Ukraine in nearly three" +
" months, causing significant damage to the energy infrastructure and" +
" raising tensions in the region as winter approaches.

Stock Market Tickers and Influence:
- EUR/USD down (geopolitical tensions)
- RUSI (Russian stocks) down (increased conflict risks)
- UGT (Ukrainian stocks) down (economic instability)
- PLW (Polish assets) volatile (heightened security concerns)"

v2 ( professional trader )

"Russia has launched a significant missile attack on Ukraine,
causing extensive damage to its power infrastructure and increasing
pressures on both the Ukrainian government and NATO allies.

Stock Market Tickers and Influence:
- PKN (PKN Orlen) down (energy supply concerns)
- TTE (TotalEnergies) down (potential supply disruptions)
- EADSY (Airbus) down (security concerns in Eastern Europe)
- LMT (Lockheed Martin) up (increased defense spending potential)
- RTX (Raytheon Technologies) up (boosted defense contracts)"

v3 significance

The COP29 climate summit in Azerbaijan is underway, with significant pressure on countries to reach a $1 trillion climate finance agreement amid fears of U.S. disengagement under President Trump's second term.

Stock Market Tickers and Influence:
- XOM (Exxon Mobil) down (concerns over fossil fuel reliance)
- CVX (Chevron) down (increased climate finance demands)
- TSLA (Tesla) volatile (renewable energy focus)
- BP (British Petroleum) down (pressure on oil companies)