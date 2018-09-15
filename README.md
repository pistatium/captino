# Captino

Captino is the Web API wrapper for Puppeteer, headless browser. Capture any page and return it as an image.

## Usage

```
docker build -t captino .
docker run -p 8000:8000 captino
http://localhost:8000/capture?url=http://example.com&width=600&height=300
```


| http://localhost:8000/capture?url=https://en.wikipedia.org/wiki/Main_Page | 
|---| 
| <img src="https://raw.githubusercontent.com/pistatium/captino/master/assets/capture.png"> |

| http://localhost:8000/capture?url=https://en.wikipedia.org/wiki/Main_Page&full=1 |
|---|
| <img src="https://raw.githubusercontent.com/pistatium/captino/master/assets/capture_full.png"> |

| http://localhost:8000/capture?url=https://en.wikipedia.org/wiki/Main_Page&width=640&height=320 |
|---|
| <img src="https://raw.githubusercontent.com/pistatium/captino/master/assets/capture_w640_h320.png"> |

## DockerHub

https://hub.docker.com/r/pistatium/captino/
