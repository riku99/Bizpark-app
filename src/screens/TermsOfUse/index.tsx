import React, { ComponentProps, useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Section } from './Section';
import { SectionPart } from './SectionPart';

type MainTextProps = {
  children: string;
} & ComponentProps<typeof Text>;

const MainText = ({ children, ...props }: MainTextProps) => {
  return (
    <Text style={[styles.text, props.style]} {...props}>
      {children}
    </Text>
  );
};

type Props = RootNavigationScreenProp<'TermsOfUse'>;

export const TermsOfUseScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '利用規約',
      headerTintColor: 'black',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contents}>
          <Text style={styles.text}>
            本利用規約（以下「本規約」と言います。）には、本サービスの提供条件及び当社と登録ユーザーの皆様との間の権利義務関係が定められています。本サービスの利用に際しては、本規約に同意いただく必要があります。
          </Text>

          <Section title={'第１条（適用）'}>
            <SectionPart part={1}>
              <Text style={styles.text}>
                本規約は、本サービスの提供条件及び本サービスの利用に関する当社と登録ユーザーとの間の権利義務関係を定めることを目的とし、登録ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
              </Text>
            </SectionPart>
          </Section>

          <Section title={'第２条（登録）'}>
            <SectionPart part={1}>
              <MainText>
                本サービスの利用を希望する者（以下「登録希望者」といいます。）は、本規約を遵守することに同意し、かつ当社の定める一定の情報（以下「登録事項」といいます。）を当社の定める方法で当社に提供することにより、当社に対し本サービスの利用を申請することができます。
              </MainText>
            </SectionPart>
          </Section>

          <SectionPart part={2}>
            <MainText>
              当社は、当社の基準に従って、第１項目に基づいて登録申請を行なった登録希望者（以下「登録申請者」といいます。）の登録の可否を判断し、当社が登録を認める場合にはその旨を登録申請者に通知します。登録申請者の登録ユーザーとしての登録は、当社が本項の通知を行なったことをもって完了したものとします。
            </MainText>
          </SectionPart>

          <SectionPart part={3}>
            <View>
              <MainText>
                当社は、登録申請者が以下の各号のいずれかの事由に該当する場合は、登録及び再登録を拒否することがあり、またその理由について一切開示義務を負いません。
              </MainText>

              <SectionPart part={1}>
                <MainText>
                  当社に提供した登録事項に虚偽、記載漏れがあった場合
                </MainText>
              </SectionPart>

              <SectionPart part={2}>
                <MainText>
                  反社会的勢力等である、または反社会的勢力との関わりがあると当社が判断した場合
                </MainText>
              </SectionPart>

              <SectionPart part={3}>
                <MainText>
                  過去当社との契約に違反したものまたはその関係者であると当社が判断した場合
                </MainText>
              </SectionPart>

              <SectionPart part={4}>
                <MainText>
                  その他、登録を適当でないと当社が判断した場合
                </MainText>
              </SectionPart>
            </View>
          </SectionPart>

          <Section title={'第3条（パスワード及びメールアドレスの管理）'}>
            <SectionPart part={1}>
              <MainText>
                登録ユーザーは、自己責任において、本サービスに関するパスワード及びメールアドレスを適切に管理及び保存するものとし、これを第三者に利用させ、または貸与、譲渡、名義変更、売買等をしてはならないものとします。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                パスワードまたはメールアドレスの管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任は登録ユーザーが負うものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title={'第4条（料金）'}>
            <MainText style={{ marginTop: 10 }}>
              本サービスはご利用いただける機能が一部制限されております。本サービスの全ての機能を使用可能にするための有料サービスプランがあります。
            </MainText>

            <SectionPart part={1}>
              <MainText>
                月額支払いであるサブスクリプションは自動で更新されます。支払いの管理は登録ユーザーが責任を持っ
                て管理するものとし、解約し忘れたことによる返金は一切行いません。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>代金決済についての領収書は発行しません。</MainText>
            </SectionPart>

            <SectionPart part={3}>
              <MainText>
                本サービスはクーリング・オフの制度が適用されません。
              </MainText>
            </SectionPart>

            <SectionPart part={4}>
              <MainText>
                課金したことにより使用可能となる機能の内容に関しては、事前の通知なく変更される可能性があることを登録ユーザーは同意するものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第５条（禁止事項）">
            <MainText style={styles.explain}>
              登録ユーザーは以下に該当する行為、または該当すると当社が判断した行為をしてはなりません。
            </MainText>

            <SectionPart part={1}>
              <MainText>
                法令に違反する行為または犯罪行為に関連する行為
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                当社、本サービスの他の利用者またはその他の第三者に対する詐欺または脅迫行為
              </MainText>
            </SectionPart>

            <SectionPart part={3}>
              <MainText>公序良俗に反する行為</MainText>
            </SectionPart>

            <SectionPart part={4}>
              <MainText>
                当社、本サービスの他の利用者またはその他の第三者の知的財産権、肖像権、プライバシーの権利、名誉、その他の権利または利益を侵害する行為
              </MainText>
            </SectionPart>

            <SectionPart part={5}>
              <MainText>
                {
                  '本サービスを通じ、以下に該当し、または該当すると当社が判断する情報を当社または本サービスに投稿、または他の利用者に送信すること \n\n ・コンピューターウイルスその他の有害なプログラムを含む情報 \n\n  ・当社、本サービスの他の利用者またはその他の第三者の名誉または信用を毀損する表現を含む情報 \n\n ・過度にわいせつな表現を含む情報 \n\n ・差別を助長する表現を含む情報 \n\n ・自殺、自傷行為を助長する表現を含む情報 \n\n ・反社会的な表現を含む情報 \n\n ・他人に不快感を与える表現を含む情報'
                }
              </MainText>
            </SectionPart>

            <SectionPart part={6}>
              <MainText>
                本サービスのネットワークまたはシステム等に過度な負荷をかける行為
              </MainText>
            </SectionPart>

            <SectionPart part={7}>
              <MainText>本サービスの運営を妨害するおそれのある行為</MainText>
            </SectionPart>

            <SectionPart part={8}>
              <MainText>不正アクセス</MainText>
            </SectionPart>

            <SectionPart part={9}>
              <MainText>第三者になりすます行為</MainText>
            </SectionPart>

            <SectionPart part={10}>
              <MainText>
                本サービスの他の利用者のメールアドレス、ID、またはパスワードを利用する行為
              </MainText>
            </SectionPart>

            <SectionPart part={11}>
              <MainText>
                当社が事前に許諾しない本サービス上での宣伝、広告、勧誘、または営業行為
              </MainText>
            </SectionPart>

            <SectionPart part={12}>
              <MainText>本サービスの他の利用者の情報の収集</MainText>
            </SectionPart>

            <SectionPart part={13}>
              <MainText>
                当社、本サービスの他の利用者またはその他の第三者に不利益、損害、不快感を与える行為
              </MainText>
            </SectionPart>

            <SectionPart part={14}>
              <MainText>反社会的勢力への利益供与</MainText>
            </SectionPart>

            <SectionPart part={15}>
              <MainText>面識のない異性との出会いを目的とした行為</MainText>
            </SectionPart>

            <SectionPart part={16}>
              <MainText>その他、当社が不適切と判断する行為</MainText>
            </SectionPart>
          </Section>

          <Section title="第６条（本サービスの停止等）">
            <MainText style={styles.explain}>
              当社は、以下のいずれかに該当する場合には登録ユーザーに通知することなく、本サービスの全部または一部の提供を停止または中断することができるものとします。
            </MainText>

            <SectionPart part={1}>
              <MainText>
                本サービスに係るコンピュータシステムの点検または保守作業を緊急に行う場合
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                コンピューター、通信回線等の障害、誤操作、過度なアクセスの集中、不正アクセス、ハッキング等により本サービスの運営ができなくなった場合
              </MainText>
            </SectionPart>

            <SectionPart part={3}>
              <MainText>
                地震、落雷、火災、風水害、停電などの不可抗力によって本サービスの運営ができなくなった場合
              </MainText>
            </SectionPart>

            <SectionPart part={4}>
              <MainText>
                その他、当社が停止または中断を必要と判断した場合
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第７条（権利帰属）">
            <SectionPart part={1}>
              <MainText>
                登録ユーザーは、投稿データについて、自らが投稿その他送信することについて適法な権利を有していること、及び投稿データが第三者の権利を侵害していないことについて、当社に対し表明し、保証するものとします。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                ユーザーは、本サービスを利用して投稿その他送信するコンテンツについて、当社に対し、世界的、非独占的、無償、サブライセンス可能かつ譲渡可能な使用、複製、配布、派生著作物の作成、表示及び実行に関するライセンスを付与します。
              </MainText>
            </SectionPart>

            <SectionPart part={3}>
              <MainText>
                登録ユーザーは、当社及び当社から権利を承継しまたは許諾された者に対して著作者人格権を行使しなことに同意するものとします。
              </MainText>
            </SectionPart>

            <SectionPart part={4}>
              <MainText>
                本サービスに関する知的財産権は全て当社に帰属しており、登録ユーザーは無断で複製，譲渡，貸与，翻訳，改変，転載，公衆送信（送信可能化を含みます。），伝送，配布，出版，営業使用等をしてはならないものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第８条（登録抹消）">
            <SectionPart part={1}>
              <MainText>
                当社は、登録ユーザーが、以下の各号のいずれかの事由に該当する場合は、事前に通知または催告することなく、投稿データを削除もしくは非表示にし、当該登録ユーザーについて本サービスの利用を一時的に停止し、または登録ユーザーとしての登録を抹消することができます。
              </MainText>

              <SectionPart part={1}>
                <MainText>本規約のいずれかの条項に違反した場合</MainText>
              </SectionPart>

              <SectionPart part={2}>
                <MainText>
                  登録事項に虚偽の事実があることが判明した場合
                </MainText>
              </SectionPart>

              <SectionPart part={3}>
                <MainText>一定期間の本サービスの利用がない場合</MainText>
              </SectionPart>

              <SectionPart part={4}>
                <MainText>
                  当社からの問い合わせに対して一定期間の返答がない場合
                </MainText>
              </SectionPart>

              <SectionPart part={5}>
                <MainText>
                  その他当社が本サービスの利用または登録ユーザーとしての登録の継続を適当でないと判断した場合
                </MainText>
              </SectionPart>
            </SectionPart>
          </Section>

          <Section title="第9条（退会）">
            <SectionPart part={1}>
              <MainText>
                登録ユーザーは、当社所定の手続きの完了により、本サービスから退会し、自己の登録ユーザーとしての登録を抹消することができます。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第10条（本サービスの内容の変更、終了）">
            <SectionPart part={1}>
              <MainText>
                当社は、当社の都合により、本サービスの内容を変更し、または提供を終了することができます。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                当社が本サービスの提供を終了する場合、極力登録ユーザーに事前通知することに努めますが、事前通知ができない可能性があることを登録ユーザーは了承するものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第11条（保証の否認及び免責）">
            <SectionPart part={1}>
              <MainText>
                当社は、本サービスが登録ユーザーの特定の目的に適合すること、期待する機能、商品的価値、正確性、適用性を有すること、登録ユーザーによる本サービスの利用が登録ユーザーに適用のある法令または業界団体の内部規制等に適合すること、継続的に利用できること、及び不具合が生じないことについて、明示又は黙示を問わず何ら保証するものではありません。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                当社は、本サービスに関して登録ユーザーが被った損害につき、当社の故意または重過失による場合を除き、一切の責任を負いません。また、付随的損害、間接的損害、特別損害、将来の損害及び逸失利益にかかる損害については、賠償責任を負わないものとします。
              </MainText>
            </SectionPart>

            <SectionPart part={3}>
              <MainText>
                本サービスに関連して登録ユーザーと他の登録ユーザーまたは第三者との間において生じた取引、連絡、紛争等については、登録ユーザーが自己の責任によって解決するものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第12条（利用者情報の取り扱い）">
            <SectionPart part={1}>
              <MainText>
                当社は、登録ユーザーが当社に提供した情報、データ等を、個人を特定できない形での統計的な情報として、当社の裁量で、利用及び公開することができるものとし、登録ユーザーはこれに異議を唱えないものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第13条（利用規約の変更）">
            <SectionPart part={1}>
              <MainText>
                当社は、当社が必要と認めた場合には、本規約を変更できるものとします。本契約を変更する場合、変更後の本規約の施工時期及び内容を適切な方法により周知し、または登録ユーザーに通知します。ただし、法令上登録ユーザーの同意が必要となるような変更の内容の場合は、当社所定の方法で登録ユーザーの同意を得るものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第14条（連絡/通知）">
            <SectionPart part={1}>
              <MainText>
                本サービスに関する問い合わせその他登録ユーザーから当社に対する連絡または通知、及び本規約の変更に関する通知その他当社から登録ユーザーに対する連絡または通知は、当社の定める方法で行うものとします。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                登録ユーザーが当社が指定する方法で別途連絡先を提出し、それを当社が受け取った場合を除いて、現在登録されている連絡先が有効なものとみなし、その連絡先に連絡を行ったっ場合、登録ユーザーは当該連絡または通知を受領したものとみなします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第15条（サービス利用契約上の地位の譲渡等">
            <SectionPart part={1}>
              <MainText>
                登録ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務につき、第三者に譲渡、移転、担保設定、その他の処分をすることはできません。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                当社は本サービスにかかる事業を他社に譲渡したい場合には、当該事業譲渡に伴い利用契約上の地位、本規約に基づく権利及び義務並びに登録ユーザーの登録事項その他の顧客情報を当該事業譲渡の譲受人に譲渡できるものとし、登録ユーザーには、かかる譲渡につき本項において予め同意したものとします。
              </MainText>
            </SectionPart>
          </Section>

          <Section title="第16条（準拠及び管轄裁判所）">
            <SectionPart part={1}>
              <MainText>
                本規約及びサービス利用契約の準拠法は日本法とします。
              </MainText>
            </SectionPart>

            <SectionPart part={2}>
              <MainText>
                本規約またはサービス利用契約に起因し、または関連する一切の紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
              </MainText>
            </SectionPart>
          </Section>

          <MainText style={styles.createdAt}>2022年6月17日 制定</MainText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  contents: {
    paddingHorizontal: 12,
    paddingTop: 20,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  explain: {
    marginTop: 10,
  },
  createdAt: {
    marginTop: 30,
  },
});
