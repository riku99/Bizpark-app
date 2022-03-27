import React, { useCallback, useEffect, createContext, useState } from 'react';
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';
import Config from 'react-native-config';
import { storage, iapReceiptStorageId } from 'src/storage/mmkv';
import { useVerifyIapReceiptMutation } from 'src/generated/graphql';

type Props = {
  children: JSX.Element;
};

const IAP_SKUS = Platform.select({
  ios: [Config.IAP_PLUS_PLAN],
});

export const IAPContext: React.Context<
  Partial<{
    processing: boolean;
    setProcessing: (v: boolean) => void;
    getProducts: () => Promise<InAppPurchases.IAPItemDetails[] | undefined>;
  }>
> = createContext({});

export const IAPProvider = ({ children }: Props) => {
  const [processing, setProcessing] = useState(false);
  const [verifyIapReceiptMutation] = useVerifyIapReceiptMutation();

  const processNewPurchace = useCallback(
    async (purchace: InAppPurchases.InAppPurchase) => {
      const { productId } = purchace;

      let body: {
        platform: string;
        productId: string;
        receipt?: string;
      } = {
        platform: Platform.OS,
        productId,
      };

      if (Platform.OS === 'ios') {
        // レシート(base64)の取得
        body.receipt = purchace.transactionReceipt;

        // サーバーでの検証処理中にエラーやユーザーがアプリキルして正常に終わらなかった場合、次回起動時に再検証行えるようにストレージに保存
        storage.set(iapReceiptStorageId, purchace.transactionReceipt);
      }

      if (Platform.OS === 'android') {
      }

      if (!body.receipt) {
        console.log('レシートが存在しません');
        return;
      }

      try {
        // 検証リクエスト
        console.log('レシート検証');
        await verifyIapReceiptMutation({
          variables: {
            input: {
              receipt: body.receipt,
              platform: body.platform,
              productId: body.productId,
            },
          },
          onCompleted: () => {
            console.log('レシート検証完了');
          },
          onError: () => {
            console.log('レシート検証失敗');
          },
        });
      } catch (e) {
        console.log(e);
        setProcessing(false);
      }
    },
    []
  );

  const getProducts = useCallback(async () => {
    const { responseCode, results } = await InAppPurchases.getProductsAsync(
      IAP_SKUS as string[]
    );

    if (responseCode === InAppPurchases.IAPResponseCode.OK) {
      return results;
    } else {
      console.log('プロダクトの取得に失敗しました');
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await InAppPurchases.connectAsync();
      } catch (e) {
        // 既に接続されている場合
        console.log('既に接続されています');
      }

      // 購入処理終了後のコールバック
      InAppPurchases.setPurchaseListener(async ({ responseCode, results }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          if (!results) {
            return;
          }

          // 購入成功時の処理。サーバー側での検証など。resultsはiOSの場合購入した1つのみが含まれる
          results.forEach(async (purhace) => {
            await processNewPurchace(purhace);
            await InAppPurchases.finishTransactionAsync(purhace, false);
          });
        } else if (
          responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED
        ) {
          console.log('ユーザーが購入をキャンセルしました');
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
          console.log('保護者の承認が必要です');
        } else {
          console.log('購入中に何らかのエラーが発生しました');
        }

        setProcessing(false);
      });
    })();

    return () => {
      (async () => {
        await InAppPurchases.disconnectAsync();
      })();
    };
  }, [processNewPurchace]);

  return (
    <IAPContext.Provider
      value={{
        processing,
        setProcessing,
        getProducts,
      }}
    >
      {children}
    </IAPContext.Provider>
  );
};
