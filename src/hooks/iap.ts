import { IAPContext } from 'src/providers/IAPProvider';
import { useContext } from 'react';
import { storage, iapReceiptStorageKey } from 'src/storage/mmkv';
import { useVerifyIapReceiptMutation } from 'src/generated/graphql';
import { useEffect } from 'react';

export const useIap = () => useContext(IAPContext);

export const useReVerifyIapReceipt = () => {
  const [verifyMutation] = useVerifyIapReceiptMutation();

  useEffect(() => {
    (async () => {
      const hasIapData = storage.contains(iapReceiptStorageKey);

      console.log(hasIapData);

      if (hasIapData) {
        const iapData = JSON.parse(storage.getString(iapReceiptStorageKey));

        await verifyMutation({
          variables: {
            input: {
              receipt: iapData.receipt,
              platform: iapData.platform,
              productId: iapData.productId,
            },
          },
          onCompleted: () => {
            console.log('レシート検証完了');
            storage.delete(iapReceiptStorageKey);
          },
          onError: () => {
            console.log('レシート検証失敗');
          },
        });
      }
    })();
  }, [verifyMutation]);
};
