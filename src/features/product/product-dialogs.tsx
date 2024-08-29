import { Dialog, Transition } from '@headlessui/react';
import { decode } from 'html-entities';
import HTMLReactParser from 'html-react-parser';
import { Fragment, ReactNode, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import dynamic from 'next/dynamic';

import { DynamicIconLoader } from '@src/components/dynamic-icon-loader';
import { Tabs } from '@src/components/tabs';
import { useProductContext } from '@src/context/product-context';
import { useSiteContext } from '@src/context/site-context';
import type { CalculateShippingProductParam } from '@src/types';
import type { DynamicIconLoaderProps } from '@src/components/dynamic-icon-loader';

const CalculateShipping = dynamic(() =>
  import('@src/features/product/calculate-shipping').then((mod) => mod.CalculateShipping)
);

import { cn } from '@src/lib/helpers/helper';
import { ProductDialog } from '@src/models/product/types';

export type DialogItem = {
  content?: string | ReactNode;
  enabled: boolean;
  icon?: ReactNode;
  isOpen?: boolean;
  key: string;
  title: string;
  link?: string;
};

type Data = DialogItem[];

export const ProductDialogs = () => {
  const { settings, calculateShipping } = useSiteContext();
  const {
    additionalData,
    product,
    state: { matchedVariant, quantity, selectedAttributes },
  } = useProductContext();

  const [open, setOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogItem>();

  const currentProduct: CalculateShippingProductParam = {
    id: product?.id as string,
    quantity,
  };

  if (product?.hasVariations && matchedVariant) {
    currentProduct.variation = {
      id: `${matchedVariant.id}`,
      ...selectedAttributes,
    };
  }

  const listData: Data = [];
  const tabData: Data = [];

  if (settings?.product?.features.calculateShipping.enabled) {
    const calculateList = {
      enabled: true,
      key: 'calculateShipping',
      title: 'Calculate Shipping',
      content: (
        <CalculateShipping
          products={[currentProduct]}
          showButton
          showRates
          title="Calculate Shipping"
        />
      ),
      icon: <DynamicIconLoader name="FiTruck" />,
    };
    listData.push(calculateList as DialogItem);
    tabData.push(calculateList as DialogItem);
  }

  if (additionalData?.dialogs) {
    additionalData.dialogs.map(function (dialog: ProductDialog, key: number) {
      if (!(dialog.content || dialog.link)) return;

      const data = {
        key: `list-data-${key}`,
        title: dialog.title,
        content: dialog.content,
        link: dialog.link,
        icon: <DynamicIconLoader name={dialog.icon as DynamicIconLoaderProps['name']} />,
      };

      listData.push(data as DialogItem);

      if (dialog.content) {
        tabData.push({
          ...data,
          enabled: true,
        });
      }
    });
  }

  const handleDialogOpen = (dataItem: DialogItem) => {
    setOpen(true);
    calculateShipping?.resetRates();
    setActiveDialog(dataItem);
  };

  const generateTabData = () => {
    return tabData.map((dialog) => ({
      ...dialog,
      isOpen: dialog.key === activeDialog?.key,
    }));
  };

  const dialogLinkStyle = {
    color: settings?.product?.font?.dialogs?.color,
  };

  const dialogLinkIconStyle = {
    color: settings?.product?.font?.dialogs?.color,
  };

  if (product?.metaData?.productLabel && settings?.isAdditionalWarningMessageEnabled) {
    dialogLinkIconStyle.color = 'red';
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-start gap-4 lg:gap-16 py-2">
        {listData.map((item, index) => (
          <a
            href={item.link ? item.link : '#'}
            key={item.key}
            id={`button-${item.key}`}
            onClick={(e) => {
              if (!item.link) {
                handleDialogOpen(item);
                e.preventDefault();
              }
            }}
            className={cn(
              'cursor-pointer font-normal leading-none text-brand-font flex gap-2 border-[#e5e7eb]',
              {
                'pl-1.5':
                  product?.metaData?.productLabel && settings?.isAdditionalWarningMessageEnabled,
                'pb-2 md:pb-0 border-b md:border-none': index === 0,
                'border-b pb-2 md:pb-0 md:border-b-0 md:border-l md:pl-4': index !== 0,
                'border-b-0 md:border-l pb-0 md:pl-4': index === listData.length - 1,
              }
            )}
            style={dialogLinkIconStyle}
          >
            {!!item.icon && item.icon}
            <span
              className="text-xs"
              style={dialogLinkStyle}
            >
              {item.title}
            </span>
          </a>
        ))}
      </div>
      {product?.metaData?.productLabel && settings?.isAdditionalWarningMessageEnabled && (
        <div className="additional-warning-message flex flex-row items-center space-x-3 border border-red-500 pl-1.5">
          <FaInfoCircle className="fill-red-500" />
          {HTMLReactParser(decode(product?.metaData?.productLabel as string))}
        </div>
      )}

      {tabData.length > 0 && (
        <Transition.Root
          show={open}
          as={Fragment}
        >
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="products-offcanvas pointer-events-auto w-screen max-w-[600px]">
                      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="overflow-y-auto py-6 px-4 sm:px-6">
                          <div className="flex items-end justify-end">
                            <div className="flex h-7 items-center">
                              <button
                                type="button"
                                className="button-offcanvas-close -m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <HiX
                                  className="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>

                          <div className="">
                            <div className="flow-root">
                              <Tabs data={generateTabData()} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      )}
    </>
  );
};