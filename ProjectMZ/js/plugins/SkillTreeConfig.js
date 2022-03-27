/*:
@target MV MZ
@plugindesc スキルツリーコンフィグ
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTreeConfig.js

@help
[概要]
スキルツリーを導入するプラグインです。
SPを使ってスキルを習得するスキルツリーを作成することができます。

[使用方法]
■ スキルツリーの設定
スキルツリーの設定は、「SkillTreeConfig.js」ファイルを編集することで行います。
基本的な設定としては、アクターごとにスキルツリーのタイプ(剣スキルや魔法スキルなど)を設定し、
そしてタイプごとにスキルツリーを構築します。
スキルツリーの構築は、スキルの派生設定(ファイアⅠを取得したらファイアⅡが取得可能になるなど)によって行います。

■ SPの入手設定
スキルの習得には、SPが必要となります。
SPの入手方法としては
・戦闘終了による獲得
・レベルアップによるSP獲得
の二通りの設定を行うことができます。

・戦闘終了時に得られるSPの設定方法
敵キャラのメモ欄に
<battleEndGainSp: SP>
の形式で記載します。

・レベルアップによるSP獲得方法の設定
コンフィグの「levelUpGainSp」によって設定を行います。

■ イベントでSPを獲得する方法
スクリプトで
skt_gainSp(アクターID, 獲得するSP値)
と記載することで、該当のアクターが指定したSPを獲得することができます。
例えば、アクターIDが1のアクターが5SPを獲得する場合、
skt_gainSp(1, 5);
と記載します。

■ 割り振った累計SPの取得
skt_totalSp(アクターID, 累計SP格納先変数ID)
と記載することで、該当のアクターが今までに割り振ったSPを指定した変数に代入することができます。
例えば、アクターIDが1のアクターの累計SPをID2の変数に代入する場合、
skt_totalSp(1, 2);
と記載します。

■ スキルリセット
スクリプトで
skt_skillReset(アクターID);
と記載することで、一度習得したスキルをリセットすることができます。
例えば、アクターIDが1のアクターのスキルリセットを行う場合、
skt_skillReset(1);
と記載します。

■ スキルツリータイプの有効/無効
スクリプトで
skt_enableType(アクターID, "タイプ名");
と記載することで、タイプを有効にします。

無効にする場合は、
skt_disableType(アクターID, "タイプ名")
と記載します。

無効にしたタイプは、スキルツリーのタイプ一覧には表示されません。

■ タイプの引継ぎ
特定の条件を満たすとスキルツリーに新たなスキルが追加されるようにしたい場合、「タイプの引継ぎ」を使用します。
例えば、タイプ「下位魔法」を「上位魔法」に変更したい場合、あらかじめ両方のタイプをコンフィグに登録した上で、
「上位魔法」は無効化しておきます。そして、タイプの引継ぎ機能を用いて、「下位魔法」を「上位魔法」に引き継がせます。

タイプの引継ぎを行う場合、スクリプトで
skt_migrationType(アクターID, "引継ぎ元タイプ名", "引継ぎ先タイプ名", リセット有無);
と記載します。リセット有無については、引継ぎ後、引継ぎ元のタイプのスキルツリーをリセットする場合、trueを、
リセットしない場合、falseを指定します。
例えば、アクターIDが1のアクターが、タイプ「下位魔法」を「上位魔法」に引き継がせ、さらにスキルリセットを行う場合、
skt_migrationType(アクターID, "下位魔法", "上位魔法", true);
と記載します。

■ マップからスキルツリーを読み込む
マップからスキルツリーの各スキルの配置座標を読み込むことで、ある程度自由なレイアウトのスキルツリーを
作成することができます。この機能によって設定可能なのはスキルの座標のみであり、スキル間の線はプラグイン側で描画します。

・スキル座標の設定
マップ上のイベントにて、設定を行います。
例えば、"ファイア"というスキルがある場合、スキルを配置したい座標に空のイベントを作成し、
イベントのメモ欄に
ファイア
と記載します。すると、"ファイア"とメモ欄に記載したイベントのXY座標がスキルのXY座標として使用されます。

■ スクリプトからスキルツリーを起動
スクリプトで
skt_open(アクターID);
と記載することで、指定したアクターのスキルツリーを起動することができます。
*/

const loadSkillTreeConfig = () => {
return {
// =============================================================
// ●ここからは設定項目です。
// =============================================================

// スキルツリーのタイプの設定を行います。
// skillTreeTypes: [ ～ ]の中にアクターの数だけタイプ設定を追加します。

// タイプ設定は、次の形式で設定します。
// { actorId: アクターのID, types: [タイプ情報1, タイプ情報2, ...] }

// タイプ情報は、次の形式で設定します。
// [タイプ種別, タイプ名, タイプの説明, タイプ有効/無効]
// タイプ種別...スキルの派生設定でタイプを識別するためのユニークな識別子を設定します。
// タイプ名...タイプ一覧のウィンドウに表示するタイプ名を設定します。
// タイプの説明...タイプ一覧のウィンドウに表示するタイプの説明を設定します。
// タイプ有効/無効...タイプを有効にする場合は、trueを、無効にする場合は、falseを指定します。
//                  この項目については、省略可能です。省略した場合、trueが指定されます。
skillTreeTypes: [
    {
        actorId: 1,
        types: [
            ["剣技", "剣技", "剣技を取得します。", true, 76],
            ["格闘技", "格闘技", "格闘技を取得します。", true, 77],
        ]
    },

    {
        actorId: 2,
        types: [
            ["剣技", "剣技", "剣技を取得します。", true, 76],
            ["格闘技", "格闘技", "格闘技を取得します。", true, 77],
        ]
    },

    {
        actorId: 3,
        types: [
            ["剣技", "剣技", "剣技を取得します。", true, 76],
            ["格闘技", "格闘技", "格闘技を取得します。", true, 77],
        ]
    },

    {
        actorId: 4,
        types: [
            ["剣技", "剣技", "剣技を取得します。", true, 76],
            ["格闘技", "格闘技", "格闘技を取得します。", true, 77],
        ]
    },

    {
        actorId: 5,
        types: [
            ["下位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", true, 79],
            ["上位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", false, 79],
            ["回復魔法", "回復魔法", "回復魔法を取得します。", true, 72],
        ]
    },

    {
        actorId: 6,
        types: [
            ["下位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", true, 79],
            ["上位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", false, 79],
            ["回復魔法", "回復魔法", "回復魔法を取得します。", true, 72],
        ]
    },

    {
        actorId: 7,
        types: [
            ["下位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", true, 79],
            ["上位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", false, 79],
            ["回復魔法", "回復魔法", "回復魔法を取得します。", true, 72],
        ]
    },

    {
        actorId: 8,
        types: [
            ["下位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", true, 79],
            ["上位攻撃魔法", "攻撃魔法", "攻撃魔法を取得します。", false, 79],
            ["回復魔法", "回復魔法", "回復魔法を取得します。", true, 72],
        ]
    },
],

// スキルツリーのマップ読み込み設定を行います。
// 読み込むマップは以下の形式で指定します。
// skillTreeMapId: { skillTreeName1: mapID1, skillTreeName2: mapID2, ... }
// skillTreeName...スキルツリーのタイプ名を指定します。
// mapID...読み込むマップIDを指定します。0の場合は読み込みを行いません。
skillTreeMapId: {
    "下位攻撃魔法": 2,
    "上位攻撃魔法": 2,
    "回復魔法": 3,
    "剣技": 4,
    "格闘技": 5,
},

// 各スキルの情報を登録します。
// skillTreeInfo: [ ～ ]の中に登録するスキル数分のスキル情報の登録を行います。

// スキル情報の登録は次の形式で行います。
// [スキル名, スキルID, 必要SP, アイコン情報]
// スキル名...スキルツリーの派生設定でスキルを一意に識別するための識別子
//            識別子なので、実際のスキル名と一致していなくても問題はありません。
// スキルID...データベース上で該当するスキルのID
// 必要SP...スキルの習得に必要なSP
// アイコン情報については、アイコンを使用するか、任意の画像を使用するかに応じて次の形式で登録します。
//   アイコンを使用する場合 ["icon", iconIndex]
//   iconIndex...使用するアイコンのインデックス
//               iconIndexは省略可能です。省略した場合、スキルに設定されているアイコンが使用されます。
//   画像を使用する場合 ["img", fileName]
//   fileName...画像のファイル名。画像は、「img/pictures」フォルダにインポートしてください。
// なお、アイコン情報については省略可能です。省略した場合、["icon"]が適用されます。
skillTreeInfo: [
    // 剣技
    ["強撃", 172, 1, ["icon_ex", "back-blue"]],
    ["薙ぎ払い", 173, 1, ["icon_ex", "back-blue"]],
    ["連続攻撃", 174, 1, ["icon_ex", "back-blue"]],
    ["気合い", 175, 1, ["icon_ex", "back-blue"]],
    ["応急処置", 176, 1, ["icon_ex", "back-blue"]],
    ["乙女の構え", 177, 1, ["icon_ex", "back-blue"]],
    ["スピンクラッシュ", 178, 1, ["icon_ex", "back-blue"]],

    // 格闘技
    ["足払い", 216, 1, ["icon_ex", "back-green"]],
    ["気孔術", 217, 1, ["icon_ex", "back-green"]],
    ["回し蹴り", 218, 1, ["icon_ex", "back-green"]],
    ["猛虎乱舞", 219, 1, ["icon_ex", "back-green"]],

    // 攻撃魔法
    ["ファイアⅠ", 99, 1, ["icon_ex", "back-red"]],
    ["ファイアⅡ", 100, 1, ["icon_ex", "back-red"]],
    ["ファイアⅢ", 101, 1, ["icon_ex", "back-red"]],

    ["フレイムⅠ", 103, 1, ["icon_ex", "back-red"]],
    ["フレイムⅡ", 104, 1, ["icon_ex", "back-red"]],
    ["フレイムⅢ", 105, 1, ["icon_ex", "back-red"]],

    ["アイスⅠ", 107, 1, ["icon_ex", "back-blue"]],
    ["アイスⅡ", 108, 1, ["icon_ex", "back-blue"]],
    ["アイスⅢ", 109, 1, ["icon_ex", "back-blue"]],

    ["ブリザードⅠ", 111, 1, ["icon_ex", "back-blue"]],
    ["ブリザードⅡ", 112, 1, ["icon_ex", "back-blue"]],
    ["ブリザードⅢ", 113, 1, ["icon_ex", "back-blue"]],

    ["サンダーⅠ", 115, 1, ["icon_ex", "back-yellow"]],
    ["サンダーⅡ", 116, 1, ["icon_ex", "back-yellow"]],
    ["サンダーⅢ", 117, 1, ["icon_ex", "back-yellow"]],

    ["スパークⅠ", 119, 1, ["icon_ex", "back-yellow"]],
    ["スパークⅡ", 120, 1, ["icon_ex", "back-yellow"]],
    ["スパークⅢ", 121, 1, ["icon_ex", "back-yellow"]],

    ["ニュークリアⅠ", 156, 1, ["icon_ex", "back-gray"]],
    ["ニュークリアⅡ", 157, 1, ["icon_ex", "back-gray"]],

    // 回復魔法
    ["ヒールⅠ", 52, 1, ["icon_ex", "back-green"]],
    ["ヒールⅡ", 53, 1, ["icon_ex", "back-green"]],
    ["ヒールⅢ", 54, 1, ["icon_ex", "back-green"]],

    ["リカバーⅠ", 56, 1, ["icon_ex", "back-green"]],
    ["リカバーⅡ", 57, 1, ["icon_ex", "back-green"]],
    ["リカバーⅢ", 58, 1, ["icon_ex", "back-green"]],

    ["キュアーⅠ", 60, 1, ["icon_ex", "back-green"]],
    ["キュアーⅡ", 61, 1, ["icon_ex", "back-green"]],
    ["キュアーⅢ", 62, 1, ["icon_ex", "back-green"]],

    ["レイズⅠ", 64, 1, ["icon_ex", "back-green"]],
    ["レイズⅡ", 65, 1, ["icon_ex", "back-green"]],
],

// スキルツリーの派生設定を行います。
// skillTreeDerivative: { ～ }の中にタイプ数分のスキルツリーの登録を行います。

// スキルツリーの派生設定は次のように行います。
// "タイプ名": [ [スキル1, [派生先スキル1, 派生先スキル2, ...]], [スキル2, [派生先スキル3, 派生先スキル4, ...] ]
// ※派生先スキルが存在しない終端スキルの場合、派生先スキルは省略可能です。
//
// 例えば、"様子を見る"と"連続攻撃"を取得すると、"２回攻撃"が取得できるようにするには、次の設定を行います。
// ["様子を見る", ["２回攻撃"]],
// ["連続攻撃", ["２回攻撃"]],
// ["２回攻撃"],
//
// また、"ヒール"を取得すると、"ファイア"と"スパーク"が取得できるようにするには、次の設定を行います。
// ["ヒール", ["ファイア"]],
// ["ヒール", ["スパーク"]],
// ["ファイア"],
// ["スパーク"],
skillTreeDerivative: {
    "剣技": [
        ["強撃", ["連続攻撃"]],
        ["薙ぎ払い", ["連続攻撃"]],
        ["気合い", ["応急処置"]],
        ["連続攻撃", ["乙女の構え"]],
        ["応急処置", ["スピンクラッシュ"]],
        ["乙女の構え", ["スピンクラッシュ"]],
        ["スピンクラッシュ"],
    ],

    "格闘技": [
        ["足払い", ["回し蹴り"]],
        ["気孔術", ["猛虎乱舞"]],
        ["回し蹴り", ["猛虎乱舞"]],
        ["猛虎乱舞"],
    ],

    "下位攻撃魔法": [
        ["ファイアⅠ", ["ファイアⅡ", "フレイムⅠ"]],
        ["ファイアⅡ", ["ファイアⅢ", "フレイムⅡ"]],
        ["フレイムⅠ", ["フレイムⅡ"]],
        ["ファイアⅢ"],
        ["フレイムⅡ"],

        ["アイスⅠ", ["アイスⅡ", "ブリザードⅠ"]],
        ["アイスⅡ", ["アイスⅢ", "ブリザードⅡ"]],
        ["ブリザードⅠ", ["ブリザードⅡ"]],
        ["アイスⅢ"],
        ["ブリザードⅡ"],

        ["サンダーⅠ", ["サンダーⅡ", "スパークⅠ"]],
        ["サンダーⅡ", ["サンダーⅢ", "スパークⅡ"]],
        ["スパークⅠ", ["スパークⅡ"]],
        ["サンダーⅢ"],
        ["スパークⅡ"],
    ],

    "上位攻撃魔法": [
        ["ファイアⅠ", ["ファイアⅡ", "フレイムⅠ"]],
        ["ファイアⅡ", ["ファイアⅢ", "フレイムⅡ"]],
        ["フレイムⅠ", ["フレイムⅡ"]],
        ["ファイアⅢ", ["フレイムⅢ"]],
        ["フレイムⅡ", ["フレイムⅢ"]],
        ["フレイムⅢ", ["ニュークリアⅠ"]],

        ["アイスⅠ", ["アイスⅡ", "ブリザードⅠ"]],
        ["アイスⅡ", ["アイスⅢ", "ブリザードⅡ"]],
        ["ブリザードⅠ", ["ブリザードⅡ"]],
        ["アイスⅢ", ["ブリザードⅢ"]],
        ["ブリザードⅡ", ["ブリザードⅢ"]],
        ["ブリザードⅢ", ["ニュークリアⅠ"]],

        ["サンダーⅠ", ["サンダーⅡ", "スパークⅠ"]],
        ["サンダーⅡ", ["サンダーⅢ", "スパークⅡ"]],
        ["スパークⅠ", ["スパークⅡ"]],
        ["サンダーⅢ", ["スパークⅢ"]],
        ["スパークⅡ", ["スパークⅢ"]],
        ["スパークⅢ", ["ニュークリアⅠ"]],

        ["ニュークリアⅠ", ["ニュークリアⅡ"]],
        ["ニュークリアⅡ"],
    ],

    "回復魔法": [
        ["キュアーⅠ", ["キュアーⅡ"]],
        ["キュアーⅡ", ["キュアーⅢ"]],
        ["キュアーⅢ", ["レイズⅠ"]],

        ["ヒールⅠ", ["ヒールⅡ", "リカバーⅠ"]],
        ["ヒールⅡ", ["ヒールⅢ"]],
        ["リカバーⅠ", ["リカバーⅡ"]],
        ["ヒールⅢ", ["リカバーⅢ"]],
        ["リカバーⅡ", ["リカバーⅢ"]],

        ["レイズⅠ", ["レイズⅡ"]],
        ["リカバーⅢ", ["レイズⅡ"]],
        ["レイズⅡ"],
    ],

    "回復魔法2": [
        ["キュアーⅠ", ["キュアーⅡ"]],
        ["キュアーⅡ", ["キュアーⅢ"]],
        ["キュアーⅢ", ["レイズⅠ"]],

        ["ヒールⅠ", ["ヒールⅡ", "リカバーⅠ"]],
        ["ヒールⅡ", ["ヒールⅢ"]],
        ["リカバーⅠ", ["リカバーⅡ"]],
        ["ヒールⅢ", ["リカバーⅢ"]],
        ["リカバーⅡ", ["リカバーⅢ"]],

        ["レイズⅠ", ["レイズⅡ"]],
        ["リカバーⅢ", ["レイズⅡ"]],
        ["レイズⅡ"],
    ],
},

// レベルアップによってSPを獲得する場合、レベルごとに得られるSP値を以下の形式で設定します。
// classId: 職業ID, default: デフォルト値, レベル: SP値, レベル: SP値, ...
// 下記の設定例では、レベル2では3SP取得、レベル3では4SP取得、それ以外のレベルでは5SPを獲得します。
levelUpGainSp: [
    {
        classId: 1,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 2,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 3,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 4,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 5,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 6,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 7,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 8,
        default: 5,
        2: 3,
        3: 4,
    },
]
// =============================================================
// ●設定項目はここまでです。
// =============================================================
};
};
