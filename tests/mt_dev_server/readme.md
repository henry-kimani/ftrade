## A dev TCP server for MTSocketAPI with MT4

### What?

This is a TCP server ment to mimic MTSocketAPI for MetaTrader4.

### Why?

I use linux, specifically NixOS. To work with the MtSocketAPI you need MetaTrader4
installed. But there is not linux version for MetaTrader4 and you have to run 
it on top of Wine (WineHQ).

This is a barrier since to get MtSocketAPI and MetaTrader4 in a linux environment
to develop programs, is a pain.

Thats why a created a TCP server that can mimic the MTSocketAPI and help linux
developers work with MT4 and MTSocketAPI with ease.

### Usage

#### Server 

Compile the `main.c` file, which contains the server code with `gcc`

```bash
gcc main.c -o main
```

Run the server:

```bash
./main
```

#### Client

Then in the client directory, run the `client.ts` file. Use `bun` if you want
an ease time.

```bash
bun client.ts
```

Edit the client.ts file to make different request.

> [!NOTE]
> The server current only supports demos for 'TRADE_HISTORY' and 'ACCOUNT_STATUS'

### Remarks

Your are free to use this code, improve on and make it yours. I will continue 
improving on it, prolly make it its own repo.

Here is a copyright of the dependancies I used, the cJSON lib.

#### Copyright for my dependancies

Copyright (c) 2009-2017 Dave Gamble and cJSON contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

