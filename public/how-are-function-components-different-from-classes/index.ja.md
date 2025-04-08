---
title: 関数コンポーネントはクラスとどう違うのか?
date: "2019-03-03"
spoiler: それらは全く別種のポケモンなのです。
---

React の関数コンポーネントは React のクラスとどう違うのでしょう？

しばらくの間、その標準的な回答は、クラスは（state のような）より多くの機能へのアクセスを提供する、というものでした。[Hooks](https://reactjs.org/docs/hooks-intro.html)によって、それはもう正しい回答ではなくなりました。

そのどちらかがパフォーマンスにおいて優れてる、と聞いたことがあるかもしれません。どちらのことでしょう？それらのベンチマークの多くには[不備がある](https://medium.com/@dan_abramov/this-benchmark-is-indeed-flawed-c3d6b5b6f97f?source=your_stories_page---------------------------)ので、私はその[結論を下す](https://github.com/ryardley/hooks-perf-issues/pull/2)のに慎重です。パフォーマンスは、関数を選ぶかクラスを選ぶかということよりも、むしろ主としてそのコードがしていることに依存しています。私たちの見てきた限り、最適化の戦略は少々[異なる](https://reactjs.org/docs/hooks-faq.html#are-hooks-slow-because-of-creating-functions-in-render)とはいえ、そのパフォーマンスの違いはわずかです。

どちらのケースであれ、その他に理由があるか、アーリーアダプターであることを気にしない限りは、すでに存在しているコンポーネントを書き直すことは[推奨していません](https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both)。Hooks は（2014 年の React がそうだったように）未だ新しく、「ベストプラクティス」のいくつかは、どうチュートリアルに組み込むべきかまだ見つけられていないのです。

では私たちに何ができるのでしょう？React の関数とクラスに何か根本的な違いはあるのでしょうか？もちろんあります — それはメンタルモデルにあるのです。**このポストでは、それらの最も大きな違いについて見ていきます。**それは 2015 年に関数コンポーネントが[導入された](https://reactjs.org/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components)時から存在したものですが、多くの場合見落とされてきました:

> **関数コンポーネントはレンダリングされた値を捕獲します。**

この意味を紐解いていきましょう。

---

**注: このポストはクラスあるいは関数に対する価値判断を行うものではありません。私は React におけるそれら 2 つのプログラミングモデルの違いを説明しているだけです。関数をより広く採用することに関する質問については、[Hooks についてのよくある質問](https://reactjs.org/docs/hooks-faq.html#adoption-strategy)を参照してください。**

---

以下のコンポーネントについて考えてください:

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```

このコンポーネントは、ネットワークリクエストを`setTimeout`によってシミュレートして、確認のアラートを出すボタンを表示します。例えば、もし`props.user`が`'Dan'`なら、3 秒後に`'Followed Dan'`と表示します。シンプルです。

_(上記の例でアロー関数式を使うか function 式を使うかというのは問題ではありません。`function handleClick()`は全く同じように動くでしょう。)_

ではこれをクラスとしてはどのように書くでしょう？単純に変換すると以下のようになります:

```jsx
class ProfilePage extends React.Component {
  showMessage = () => {
    alert("Followed " + this.props.user);
  };

  handleClick = () => {
    setTimeout(this.showMessage, 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

これら 2 つのコードのスニペットは一般的に同等のものだと考えられています。人々は多くの場合、これらのパターン間を自由にリファクタします。それが引き起こす結果に気がつかずに:

![2つのバージョンの違いを突き止める](./wtf.gif)

**しかし、これらの 2 つのスニペットは微妙に異なるものなのです。**よく見てください。もうその違いがわかりましたか？個人的には、気がつくまでにしばらく時間がかかりました。

**この先にネタバレがあります。自分で解き明かしたい人のために、[ライブデモ](https://codesandbox.io/s/pjqnl16lm7) を用意しました。**この記事の残りはその違いとなぜそれが問題なのか、を説明しています。

---

ここから先を続ける前に、ここで説明する違いは React の Hooks と本質的には何も関係がない、ということを強調しておきたいです。上記の例に至っては Hooks を使ってすらいません！

以下は全て React における関数とクラスの違いについてです。もしあなたが React のアプリケーションでより頻繁に関数を使うつもりなら、理解するとよいと思います。

---

**React のアプリケーションで一般的に見られるバグを用いてその違いを解説しましょう。**

この[サンプルのサンドボックス](https://codesandbox.io/s/pjqnl16lm7)を開いて見てください。現在のプロフィールのためのセレクタがあり、上に記載した 2 種類の実装の`ProfilePage`が、それぞれフォローボタンをレンダリングしています。

以下の一連の動作をそれぞれのボタンで試して見てください:

1. フォローボタンのどちらか 1 つを**クリックする**。
2. 3 秒以内にプロフィールの選択を**変更する**。
3. アラートのテキストを**読む**。

妙な違いに気がつくでしょう:

- **関数**の`ProfilePage`の場合、 Dan のプロフィールでフォローをクリックして、Sophie のプロフィールに移動しても、アラートは `'Followed Dan'`のままです。

- **クラス**の`ProfilePage`の場合、アラートは `'Followed Sophie'`となります:

![それらのステップのデモンストレーション](./bug.gif)

---

この例では、最初の挙動が正しいものです。**もし私がある人をフォローして、その後別の人のプロフィールに移動したとしても、コンポーネントは私が誰をフォローしたのか間違えてはいけません。**このクラスの実装は明らかにバグっています。

_(当然[Sophie をフォロー](https://mobile.twitter.com/sophiebits)すべきだとは思いますが。)_

---

ではクラスの例はなぜこのように振る舞うのでしょう？

クラス内の`showMessage`メソッドをよく見てましょう:

```jsx {3}
class ProfilePage extends React.Component {
  showMessage = () => {
    alert('Followed ' + this.props.user);
  };
```

このクラスメソッドは`this.props.user`を読み取っています。props は React においてはイミュータブルなので、変化しません。**しかし、`this`は*今ここでは*、そしてこれまでも、ミュータブルなのです。**

実際、それこそがクラスにおける`this`の目的なのです。React 自体がそれを時に応じて書き換えることで、`render`やライフサイクルメソッドの中でその新鮮なバージョンを読み取ることができるのです。

なので、リクエストの送信中にコンポーネントが再度レンダリングすると、`this.props`は変化します。そして`showMessage`メソッドは「新しすぎる」`props`から`user`を読み取ることになります。

これはユーザインタフェースの性質における興味深い知見を明らかにしています。もし、UI が概念的にはアプリケーションの現在の状態を表す機能である、とすると、**イベントハンドラは、その見た目上の結果同様、レンダリング結果の一部です。**イベントハンドラは特定の props と state を用いた特定の render に「属しています」。

しかし、`this.props`を読み取るコールバックを持った timeout をスケジューリングすることは、この連携を破壊します。`showMessage`というコールバックはいずれの render とも「紐づく」ことがなく、正しい props を「見失ってしまう」のです。`this`からの読み取りがそれらの連結を切り離します。

---

**関数コンポーネントが存在しないとしましょう。** どうやってこの問題を解決できるでしょう？

正しい props を用いた`render`とそれらの props を読み取る`showMessage`コールバックとの連結をどうにか「修復」したいです。どこか途中で`props`は道に迷ってしまっています。

その方法の 1 つは`this.props`をイベントの早い地点で読み取り、timeout を完成させるハンドラにそれらを明示的に渡すことです:

```jsx {2,7}
class ProfilePage extends React.Component {
  showMessage = (user) => {
    alert("Followed " + user);
  };

  handleClick = () => {
    const { user } = this.props;
    setTimeout(() => this.showMessage(user), 3000);
  };

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

これは[うまくいきます](https://codesandbox.io/s/3q737pw8lq)。しかし、このアプローチはコードをかなり冗長にし、時間が経つにつれにエラーを起こしやすくします。もし 1 つ以上の prop が必要になったらどうなるでしょう？もし state にアクセスする必要もでてきたら？**もし`showMessage`が別のメソッドを呼んで、そしてそのメソッドが`this.props.something`や`this.state.something`を読み取るのだとしたら、全く同じ問題に再度直面することになります。**そして`showMessage`から呼ばれている全てのメソッドに`this.props`と`this.state`を引数として渡さなければならなくなるでしょう。

そうすることはクラスが通常もたらすはずの人間工学を打ち負かすことになります。また、こうすることを覚えていたり強制するのは難しいことです。だから多くの場合は代わりにバグを作ることで手を打つことになるのです。

同じように、`handleClick`の内部に`alert`をインライン化することはより大きな問題への回答になりません。私たちは、より多くのメソッドに分割できるようなやり方で、_そしてそれだけではなく_、その呼び出しに関連する render に対応する props と state を読み取れるようなやり方で、コードを構築したいのです。**この問題は React に特有の問題ではありません。 - `this`のようなミュータブルなオブジェクトにデータを置くあらゆる UI ライブラリでも再現できる問題です。**

もしかして、メソッドをコンストラクタ内で*bind*できるでしょうか？

```jsx {4-5}
class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.showMessage = this.showMessage.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  showMessage() {
    alert("Followed " + this.props.user);
  }

  handleClick() {
    setTimeout(this.showMessage, 3000);
  }

  render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}
```

いえ、これは何も修復していません。問題は`this.props`から読み取るのが遅すぎることにあるのを思い出してください。どのシンタックスを使っているのかが問題ではないのです！**しかし、この問題は私たちが JavaScript のクロージャに完全に頼ってしまえば消え去るのです。**

クロージャは多くの場合避けられています。なぜなら時間の経過と共に書き換えられ得る値について考えるのは[困難](https://wsvincent.com/javascript-closure-settimeout-for-loop/)だからです。しかし React では、props と state はイミュータブルです！（あるいは少なくとも、そうであることが強く推奨されています。）このことはクロージャにおける主要な footgun を取り除きます。

これは、もし特定の render で発生した props や state を閉じ込めれば、それらがいつでも同じものだとみなせることを意味します:

```jsx {3,4,9}
class ProfilePage extends React.Component {
  render() {
    // propsを捕獲しましょう!
    const props = this.props;

    // 注: ここは*render内部*です。
    // なのでこれらはクラスメソッドではありません。
    const showMessage = () => {
      alert("Followed " + props.user);
    };

    const handleClick = () => {
      setTimeout(showMessage, 3000);
    };

    return <button onClick={handleClick}>Follow</button>;
  }
}
```

**あなたは render の瞬間の props を「捕獲した」のです:**

![ポケモンを捕獲する](./pokemon.gif)

こうすることで、（`showMessage`を含む）この内部のあらゆるコードは、特定の render のための props を見ることが保証されます。もう React が「チーズを消してしまう」ことはありません。

**その上で、その内部にヘルパー関数を好きなだけ追加することできます。それらは全て捕獲された props と state を使います。**レスキュー(解放)へと通じるクロージャ(閉鎖)なのです！

---

[上記の例](https://codesandbox.io/s/oqxy9m7om5)は正しいのですが、中途半端に見えます。もしクラスメソッドを使う代わりに`render`内部に関数を定義するなら、クラスを持つことの意義は何でしょうか？

確かに、その周りのクラスという「殻」を取り除くことで、コードをシンプルにすることが可能です:

```jsx
function ProfilePage(props) {
  const showMessage = () => {
    alert("Followed " + props.user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```

先に挙げた例のように、`props`は捕獲されています - React がそれらを引数として渡します。**`this`とは異なり、`props`オブジェクト自体は React によって書き換えられることはありません。**

関数定義内で`props`を分割すると、このことがもう少し明白になります:

```jsx {1,3}
function ProfilePage({ user }) {
  const showMessage = () => {
    alert("Followed " + user);
  };

  const handleClick = () => {
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}
```

親コンポーネントが別の props で`ProfilePage`をレンダリングする時、React は`ProfilePage`関数を再度呼び出します。しかし私たちが既にクリックしたそのイベントハンドラはそれ以前の render に「属して」います。そしてそちらは独自の`user`の値を使っており、その`showMessage`コールバックはその値を読み取っています。それらはそのまま残っているのです。

これが、この関数バージョンの[デモ](https://codesandbox.io/s/pjqnl16lm7)において、Sophie のプロフィールにてフォローをクリックして、その後 Sunil に選択を変えても`'Followed Sophie'`とアラートがでる理由です:

![正しい挙動のデモ](./fix.gif)

この挙動は正しいものです。_([Sunil もフォロー](https://mobile.twitter.com/threepointone)した方がいいと思うのですが！)_

---

これで React における関数とクラスの大きな違いを理解できました:

> **関数コンポーネントはレンダリングされた値を捕獲します。**

**Hooks を使えば、同じ原則が state にも適応できます。**以下の例を考えてみて下さい:

```jsx
function MessageThread() {
  const [message, setMessage] = useState("");

  const showMessage = () => {
    alert("You said: " + message);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <input value={message} onChange={handleMessageChange} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
}
```

(こちらが [ライブデモ](https://codesandbox.io/s/93m5mz9w24)です。)

これはよくできたメッセージアプリの UI ではありませんが、同じポイントを説明しています: もし私が特定のメッセージを送る場合、そのコンポーネントはどのメッセージが送られたかを間違えるべきではありません。この関数コンポーネントの`message`は、ブラウザに呼び出されたクリックハンドラを返却した render に「属する」state を捕獲します。なので`message`は私が「Send」をクリックした時の入力にあったものになります。

---

React の関数がデフォルトで props と state を捕獲することはわかったと思います。**しかし、もし私たちが、その特定の render に属していない最新の props もしくは state を読み取り*たい*場合はどうなるでしょう？**もし私たちが[「未来からそれらを読み取りたい」](https://dev.to/scastiel/react-hooks-get-the-current-state-back-to-the-future-3op2)場合はどうでしょう？

クラスにおいては、`this.props`もしくは`this.state`を読み取ることでそれができるでしょう。なぜなら`this`自体がミュータブルだからです。React がそれを書き換えます。関数コンポーネントにおいても、あらゆるコンポーネントの render に共有されるミュータブルな値を持つことが可能です。それは「ref」と呼ばれています:

```jsx
function MyComponent() {
  const ref = useRef(null);
  // `ref.current`の読み取り、もしくは、書き込みが可能です。
  // ...
}
```

しかしながら、ref はあなたが自分で管理する必要があります。

ref はインスタンスフィールドと[同じ役割を持ちます](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables)。それはミュータブルで命令型の世界への脱出口です。「DOM の ref」という考えに馴染みがあるかもしれませんが、そのコンセプトははるかに汎用的です。それは中に何かを入れるための単なる入れ物なのです。

視覚的にも、`this.something`は`something.current`の鏡のようです。それらは同じコンセプトを表しています。

デフォルトでは、React が関数コンポーネント内で最新の props や state のための ref を作ることはありません。多くの場合それらは必要ありませんし、それらをアサインするのは無駄な仕事でしょう。しかし、もしそうしたければその値を手動で追跡することは可能です:

```jsx {3,6,15}
function MessageThread() {
  const [message, setMessage] = useState('');
  const latestMessage = useRef('');

  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };

  const handleSendClick = () => {
    setTimeout(showMessage, 3000);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    latestMessage.current = e.target.value;
  };
```

`showMessage`内の`message`を読み取ると、Send ボタンを押した時の message を見ることになるでしょう。しかし`latestMessage.current`を読み取ると、たとえ Send ボタンが押された後にタイピングし続けたとしても、その最新の値が取得されます。

自分でその違いを見たければ、この[2 つ](https://codesandbox.io/s/93m5mz9w24)の[デモ](https://codesandbox.io/s/ox200vw8k9)を比較できます。ref はレンダリングの一貫性を「オプトアウト」する方法であり、場合によっては便利なものです。

一般的に、レンダリングの途中で ref を読み取ったりセットしたりすることは避けるべきです。なぜならそれはミュータブルだからです。私たちはレンダリングを予測可能なものに保ちたいと思っています。**しかし、もし特定の prop や state の最新の値を取得したいなら、手動で ref を更新するのは面倒でしょう。**副作用(effect)を使うことでそれを自動化することが可能です:

```jsx {4-8,11}
function MessageThread() {
  const [message, setMessage] = useState('');

  // 最新の値を追跡し続ける
  const latestMessage = useRef('');
  useEffect(() => {
    latestMessage.current = message;
  });

  const showMessage = () => {
    alert('You said: ' + latestMessage.current);
  };
```

([デモ](https://codesandbox.io/s/yqmnz7xy8x)はこちら。)

DOM が更新された後にのみ ref の値が変化するように、副作用の*内部*でアサインを行います。このことはレンダリングが割り込み可能であることに依存している[Time Slicing や Suspense](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)のような機能を、この書き換えが壊さないことを保証します。

このような形で ref を使うことはあまり必要になりません。**通常の場合 props や state を捕獲することがより良いデフォルトです。**しかし、intervals や subscriptions のような[命令型の API](/making-setinterval-declarative-with-react-hooks/)を扱う時には、これは便利なものになり得ます。*どのような*値でも追跡できる、ということを覚えておいてください。1 つの prop、state 変数、props オブジェクト全体、あるいは関数でさえも、です。

このパターンは、`useCallback`の中身が頻繁に変わるような場合などでの、最適化においても有用です。ただ、[reducer を使うこと](https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)が多くの場合は[より良いソリューション](https://github.com/ryardley/hooks-perf-issues/pull/3)です。（これは今後のブログポストのトピックです！）

---

このポストでは、クラスにおける一般的な壊れ方のパターンを、そしてクロージャがそれを修復するのにどれだけ役立つかを見てきました。しかし依存する配列を指定することで Hooks を最適化しようとすると、クロージャが古くなってしまうというバグに遭遇し得ることに気づいたかもしれません。これはクロージャが問題だということでしょうか？私はそうは思いません。

ここまでで見てきたように、クロージャは気がつくのが難しい繊細な問題を実際に*修復します*。同様に、[並列モード](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)で正しく動くコードを書くのをはるかに容易にします。これが可能になるのは、そのコンポーネントのロジックがレンダリングされた時の正しい props と state を閉じ込めるからです。

私がこれまで見てきたあらゆるケースにおいて、**「古くなったクロージャ」問題は「関数は変化しない」や「props は常に同じだ」という誤った想定のせいで起きています。**なので、このポストがそれをはっきり説明することの助けになればと望むのですが、クロージャが問題だというのは正しくありません。

関数はその props と state を閉じ込めます - だからそれらが一貫していることは同様に重要なことなのです。これはバグではなく、関数コンポーネントの機能です。関数は、例えば`useEffect`や`useCallback`の「依存する配列」から除外されるべきではありません。（適切な修正は通常`useReducer`か上記の`useRef`というソリューションです - このどちらを選ぶべきかについては近いうちにドキュメント化します。）

React の大半のコードを関数で書く時、私たちは[コードの最適化](https://github.com/ryardley/hooks-perf-issues/pull/3)や[時間の経過と共に変わる値](https://github.com/facebook/react/issues/14920)についての自分の直感を調整する必要がでてきます。

[Fredrik が書いたように](https://mobile.twitter.com/EphemeralCircle/status/1099095063223812096):

> これまでで気がついた Hooks を使う際のベストなメンタルルールは「あらゆる値があらゆる時に変わり得るかのようにコードを書く」だ。

関数もこのルールの例外ではありません。これが React の学習資料で共通のナレッジになるには時間がかかるでしょう。クラスのマインドセットからの調整も必要になります。でも、この記事がそのことを新鮮な目で見ることの助けになればと思っています。

React の関数は常にその値を捕獲します - そして、それがなぜだかをもうわかったでしょう。

![笑顔のピカチュー](./pikachu.gif)

彼らは完全に別種のポケモンなのです。
