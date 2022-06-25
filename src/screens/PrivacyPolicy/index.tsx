import React, { useLayoutEffect } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { MainText as Text } from '../../components/TermsOfUseAndPrivacyPolicyUtils/MainText';
import { Section } from '../../components/TermsOfUseAndPrivacyPolicyUtils/Section';
import { SectionPart } from '../../components/TermsOfUseAndPrivacyPolicyUtils/SectionPart';

type Props = RootNavigationScreenProp<'PrivacyPolicy'>;

export const PrivacyPolicyScreen = ({ navigation }: Props) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'プライバシーポリシー',
      headerTintColor: 'black',
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contents}>
          <Text>
            Bizpark（以下「当社」と言います）は、当社の提供するサービス（以下「本サービス」といいます。）におけるユーザーについての個人情報を含む利用者情報の取り扱いについて、以下とおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </Text>

          <Section title="1. 収集する利用者情報及び収集方法">
            <Text style={{ marginTop: 10 }}>
              本ポリシーにおいて、「利用者情報」とは、ユーザーの識別に係る情報、通信サービス上の行動履歴、その他ユーザーまたはユーザーの端末に関連して生成または蓄積された情報であって、本ポリシーに基づき当社が収集するものを意味するものとします。
            </Text>

            <Text style={{ marginTop: 10 }}>
              本サービスにおいて当社はメールアドレス、生年月日、その他入力フォームにてユーザーが入力または送信する情報などの個人情報を収集する場合がございます。また、ユーザーが本サービスの利用において、他のサービスと連携を許可することにより当該他のサービスからご提供いただく情報を収集する場合がございます。
            </Text>
          </Section>

          <Section title="2. 利用目的">
            <Text style={{ marginTop: 10 }}>
              本サービスのサービス提供にかかわる利用者情報の具体的な利用目的は以下の通りです。
            </Text>

            <SectionPart part={1}>
              <Text>
                本サービスに関する登録の受付、ユーザー認証、ユーザー設定の記録等本サービスの提供、維持、保護及び改善のため
              </Text>
            </SectionPart>

            <SectionPart part={2}>
              <Text>ユーザーのトラフィック測定及び行動測定のため</Text>
            </SectionPart>

            <SectionPart part={3}>
              <Text>広告の配信、表示及び効果測定のため</Text>
            </SectionPart>

            <SectionPart part={4}>
              <Text>本サービスに関するご案内、お問い合わせへの対応のため</Text>
            </SectionPart>

            <SectionPart part={5}>
              <Text>
                本サービスに関する当社の規約、ポリシー等に違反する行為に対する対応のため
              </Text>
            </SectionPart>

            <SectionPart part={6}>
              <Text>本サービスに関する規約等の変更などを通知するため</Text>
            </SectionPart>
          </Section>

          <Section title="3. 利用中止要請の方法">
            <Text style={{ marginTop: 10 }}>
              ユーザーは、本サービスの所定の設定を行うことにより、利用者情報の全部または一部についてその収集又は利用の停止を求めることができ、この場合、当社は速やかに当社の定めるところに従いその利用を停止します。なお利用者情報の項目によっては、その収集または利用が本サービスの前提となるため、当社所定の方法により本サービスを退会した場合に限り、当社はその収集又は利用を停止します。
            </Text>
          </Section>

          <Section title="4. 第三者提供">
            <Text style={{ marginTop: 10 }}>
              当社は、利用者情報のうち、個人情報については、あらかじめユーザーの同意を得ないで、第三者（日本国外にある者を含みます。）に提供しません。但し、次に掲げる必要があり第三者（日本国外にある者を含みます。）に提供する場合はこの限りではありません。
            </Text>

            <SectionPart part={1}>
              <Text>
                当社が利用目的の達成に必要な範囲内において個人情報の取り扱いの全部または一部を委託する場合
              </Text>
            </SectionPart>

            <SectionPart part={2}>
              <Text>
                合併その他の事由による事業の承継に伴って個人情報が提供される場合
              </Text>
            </SectionPart>

            <SectionPart part={3}>
              <Text>
                国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることによって当該事務の遂行に支障を及ぼすおそれがある場合
              </Text>
            </SectionPart>

            <SectionPart part={4}>
              <Text>
                その他、個人情報の保護に関する法律その他の法令で認められる場合
              </Text>
            </SectionPart>
          </Section>

          <Section title="5. 個人情報の開示">
            <Text style={{ marginTop: 10 }}>
              当社は、ユーザーから個人情報保護法の定めに基づき個人情報の開示を求められた時は、ユーザーご本人からのご請求であることを確認の上で、ユーザーに対し、延滞なく開示を行います（当該情報が存在しない時にはその旨を通知いたします）。但し、個人情報保護法その他の法令により、当社が開示の義務を負わない場合には、この限りではありません。なお、個人情報の開示につきましては、手数料（一件あたり10,000円）を頂戴しておりますので、あらかじめご了承ください。
            </Text>
          </Section>

          <Section title="6. 個人情報の訂正及び利用停止等">
            <Text style={{ marginTop: 10 }}>
              当社は、ユーザーから、（１）個人情報が真実でないという理由によって個人情報保護法の定めに基づきその内容の訂正を求められた場合、及び（２）あらかじめ公表された利用目的の範囲を超えて取り扱われているという理由または偽りその他不正の手段により収集されたものであるという理由により、個人情報保護法の定めに基づきその利用の停止を求められた場合には、ユーザーご本人からのご請求であることを確認の上で延滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正または利用停止を行い、その旨をユーザーに通知します。なお、訂正または利用停止を行わない旨の決定をした時は、ユーザーに対しその旨を通知します。
            </Text>

            <Text style={{ marginTop: 10 }}>
              当社は、ユーザーからユーザーの個人情報について消去を求められた場合、当社が当該請求に応じる必要があると判断した場合は、ユーザーご本人からのご請求であることを確認の上で、個人情報の消去を行い、その旨をユーザーに通知します。
            </Text>

            <Text style={{ marginTop: 10 }}>
              個人情報保護法その他法令により、当社が訂正等または利用停止等の義務を負わない場合は、上記の規定は適用されません。
            </Text>
          </Section>

          <Section title="7. お問い合わせ窓口">
            <Text style={{ marginTop: 10 }}>
              <>
                <Text
                  style={{ textDecorationLine: 'underline' }}
                  onPress={async () => {
                    await Linking.openURL(
                      'https://docs.google.com/forms/d/e/1FAIpQLSe7lC7W6qR0TqE3x0Wp5WyumNOtjW3-B3l7iLV0Yuiu9wyXWA/viewform?usp=sf_link'
                    );
                  }}
                >
                  こちら
                </Text>
                からお問い合わせください
              </>
            </Text>
          </Section>

          <Section title="8. プライバシーポリシーの変更">
            <Text style={{ marginTop: 10 }}>
              当社は必要に応じて、本ポリシーを変更します。但し、法令上ユーザーの同意が必要となるような変更を行う場合、変更後の本ポリシーは、変更に同意したユーザーに対してのみ適用されるものとします。なお、当社は変更後の本ポリシーの施行時期及び内容を本サービスまたはその時点で存在する場合は当社Webサイトにより通知します。
            </Text>
          </Section>

          <Text style={{ marginTop: 40 }}>2022年6月25日制定</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contents: {
    paddingHorizontal: 12,
    paddingTop: 20,
  },
});
