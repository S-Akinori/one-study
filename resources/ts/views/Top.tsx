import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Top = () => {
  return (
    <div className="py-4">
      <div className="p-top-page__download">
        <h1 className="text-center text-2xl font-bold py-8">
          1ページを共有しよう<br />
          One Study
        </h1>
        <div className="w-2/3 max-w-sm mx-auto">
          <img src="/storage/app_mobile.png" width="580" height="1150" alt="One Study" />
        </div>
        <div className="text-center py-4">
          <Link to="/register">
            <Button variant="contained">今すぐ始める</Button>
          </Link>
        </div>
      </div>
      <section className="p-top-page__about py-16 px-4">
        <h2 className="p-top-page__about__title text-xl text-center font-bold">1Study</h2>
        <p className="text-center">
          自分が学んだ内容を1ページでまとめ、<br />
          発信するSNSです。<br />
          発信によりアウトプットしたり<br />
          仲間の投稿をインプットして<br />
          自分の将来につなげましょう！
        </p>
      </section>
      <section className="p-top-page__reason py-16 px-4">
        <h2 className="p-top-page__reason__title text-xl text-center font-bold">1Studyを使う理由</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="py-4">
            <img src="/storage/handwriting.jpg" alt="1ページに要約することで頭を整理できる" />
            <h3 className="text-lg font-bold">1ページに要約することで頭を整理できる</h3>
            <p>
              ・授業で学んだこと<br />
              ・問題でよく使う解法<br />
              ・解説にはない自分が見つけた解法<br />
              ・学校では学ばないけど「面白い！」と思った内容<br />
              簡潔にまとめることでテストなどの実践で使える知識を身に付けることができます。
            </p>
          </div>
          <div className="py-4">
            <img src="/storage/study-together.jpg" alt="アウトプットがいつでもできる！" />
            <h3 className="text-lg font-bold">アウトプットがいつでもできる！</h3>
            <p>
              普段は「他人教える」という習慣がないですが、教える
              ことこそが最も効果的な勉強法です。
              そんな教える環境を1Studyが提供しています。
            </p>
          </div>
          <div className="py-4">
            <img src="/storage/woman-use-phone.jpeg" alt="仲間の役立つ情報が手に入る" />
            <h3 className="text-lg font-bold">仲間の役立つ情報が手に入る</h3>
            <p>
              勉強仲間が発信した内容にはあなたの助けになる
              ヒントが含まれています。<br />
              仲間が整理したものをそのまま自分の知識にして
              理解を深められます。
            </p>
          </div>
        </div>
      </section>
      <section className="p-top-page__use py-16 px-4">
        <h2 className="p-top-page__use__title text-xl text-center font-bold">1Studyの使い方</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="py-4 text-center">
            <h3 className="py-4 text-xl font-bold">1 あなたの1ページを撮ろう</h3>
            <p>ノートに手書きしたものでも、イラストにしたものでも、画像であれば何でもOK!</p>
            <div className="w-2/3 mx-auto py-4">
              <img src="/storage/photo-scan.png" width="300" height="300" alt="あなたの1ページを撮ろう" />
            </div>
          </div>
          <div className="py-4 text-center">
            <h3 className="py-4 text-xl font-bold">2 写真を投稿しよう</h3>
            <div className="w-2/3 mx-auto py-4">
              <img src="/storage/upload.jpg" width="300" height="300" alt="写真を投稿しよう" />
            </div>
          </div>
          <div className="py-4 text-center">
            <h3 className="py-4 text-xl font-bold">3 役立つ1ページは保存しよう</h3>
            <p>仲間が投稿したものは自分のスマホにダウンロードできます。あなただけの参考書が出来上がります</p>
            <div className="w-2/3 mx-auto py-4">
              <img src="/storage/download.jpg" width="300" height="300" alt="役立つ1ページは保存しよう" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 px-4 p-top-page__download">
        <p className="text-2xl text-center">わたしたちの1ページを共有しよう</p>
        <div className="text-center py-4">
        <Link to="/register">
          <Button variant="contained">Web版で始める</Button>
        </Link>
        </div>
        <div className="w-2/3 max-w-sm mx-auto">
          <img src="/storage/app_mobile.png" width="580" height="1150" alt="One Study" />
        </div>
      </section>
    </div>
  )
}

export default Top;