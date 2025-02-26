# AutoKommentar

法令の条文を自動で解析し、条ごとに定義語や参照先、括弧書きなどを可視化します。定義語や参照先は、一目で内容が分かるように条文のそばに一覧表示します。条文はe-Gov法令APIから最新の条文を取得します。

[こちら](https://yamachig.github.io/autokommentar/#/405AC0000000088/a=39)からお試しください。

## ブラウザ拡張機能のインストール

AutoKommentarのブラウザ拡張機能をインストールすると、e-Gov法令検索の条文ページを表示した際に、それぞれの条の左に「A」ボタンが表示され、AutoKommentarに遷移することができます。

1. [こちらのリンク](https://yamachig.github.io/autokommentar/autokommentar-helper-elaws.zip)から拡張機能のZipファイルをダウンロードし、解凍してください。
2. 次の手順に従って拡張機能をインストールしてください。

    - Chromeの場合: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?hl=ja#load-unpacked
    - Firefoxの場合: https://developer.mozilla.org/ja/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#%E5%8B%95%E3%81%8B%E3%81%97%E3%81%A6%E3%81%BF%E3%82%88%E3%81%86

## 参考

法令データの取得に[法令API Version 2](https://www.digital.go.jp/news/74dc5116-16bb-4dae-a632-02aa83b65170)及び[Version 1](https://laws.e-gov.go.jp/apitop/)を使用しています。また、定義語・条項参照などは[Lawtext](https://github.com/yamachig/Lawtext)で解析しています。
