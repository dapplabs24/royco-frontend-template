"use client";

import React, { Fragment } from "react";
import { useMarketManager } from "@/store";
import { MarketSteps, MarketViewType } from "@/store/market-manager-props";
import { cn } from "@/lib/utils";
import { MarketActionForm } from "../market-action-form";
import { useActiveMarket } from "../hooks";
import { LoadingSpinner } from "@/components/composables";
import { Switch } from "@/components/ui/switch";
import { MarketInfo } from "../market-info";
import { IncentiveInfo } from "../incentive-info";
import { AlertIndicator } from "@/components/common";
import { OfferList } from "../offer-list";
import { SlideUpWrapper } from "@/components/animations";
import { BASE_PADDING_LEFT, BASE_PADDING_RIGHT } from "../composables";
import { ChevronLeftIcon } from "lucide-react";
import { OfferListVisualizer } from "../offer-list-visualizer";
import { BalanceIndicator } from "../balance-indicator";
import { motion } from "framer-motion";
import { StatsTables } from "../stats-tables/stats-tables";
import { WarningBox } from "@/components/composables";
import { MAX_SCREEN_WIDTH } from "@/components/constants";

export const MarketManager = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { viewType, setViewType, marketStep, setMarketStep } =
    useMarketManager();

  const {
    isLoading,
    propsEnrichedMarket,
    currentMarketData,
    previousMarketData,
    marketMetadata,
  } = useActiveMarket();

  // console.log("currentMarketData", currentMarketData);

  if (isLoading) {
    return <LoadingSpinner className="h-5 w-5" />;
  } else if (!currentMarketData) {
    return (
      <SlideUpWrapper className="flex w-full flex-col place-content-center items-center">
        <AlertIndicator
          className={cn(
            "h-96 w-full rounded-2xl border border-divider bg-white",
            MAX_SCREEN_WIDTH
          )}
        >
          Market dashboard isn't live yet. Check back later. This takes a few
          minutes if you've just deployed your market.
        </AlertIndicator>
      </SlideUpWrapper>
    );
  } else if (!!currentMarketData && !!marketMetadata) {
    return (
      <Fragment>
        {currentMarketData.is_verified === false && (
          <WarningBox
            className={cn(
              MAX_SCREEN_WIDTH,
              viewType === MarketViewType.simple.id && "mb-10",
              viewType === MarketViewType.advanced.id && "mb-10"
            )}
            text="This is an unverified market and may lead to loss of assets upon interaction. Please make sure that you understand the risks before interacting with this market."
          />
        )}

        <div
          className={cn(
            "flex w-full max-w-lg flex-row items-center justify-between pb-3",
            viewType === MarketViewType.advanced.id && MAX_SCREEN_WIDTH
          )}
        >
          <div
            onClick={() =>
              window.open("/explore", "_self", "noopener noreferrer")
            }
            className={cn(
              "flex cursor-pointer flex-row items-center gap-0 font-gt text-sm font-light text-secondary",
              "transition-all duration-200 ease-in-out hover:opacity-80"
            )}
          >
            <ChevronLeftIcon
              strokeWidth={1.5}
              className="h-6 w-6 text-secondary"
            />

            <div className="flex h-4">
              <span className={cn("leading-5")}>Explore</span>
            </div>
          </div>

          <div
            className={cn(
              "relative flex w-fit shrink-0 flex-row items-center gap-3 ",
              viewType === MarketViewType.simple.id && "opacity-0"
            )}
          >
            {viewType === MarketViewType.simple.id && (
              <div className="absolute left-0 top-0 h-full w-full"></div>
            )}

            <div className="font-gt text-sm font-light text-secondary">
              Advanced Mode
            </div>
            <Switch
              checked={viewType === MarketViewType.advanced.id}
              onCheckedChange={() => {
                setViewType(
                  viewType === MarketViewType.advanced.id
                    ? MarketViewType.simple.id
                    : MarketViewType.advanced.id
                );
              }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeIn" }}
          key={`market-manager:${viewType}`}
          className={cn(
            "flex items-center rounded-2xl border border-divider bg-white",
            "w-full overflow-hidden",
            MAX_SCREEN_WIDTH,
            viewType === MarketViewType.advanced.id &&
              "h-fit flex-col md:h-[70rem] md:flex-row md:divide-x",
            viewType === MarketViewType.simple.id &&
              "h-fit max-w-lg flex-col md:h-[70rem]",
            "flex-0"
          )}
        >
          {viewType === MarketViewType.simple.id ? (
            <Fragment>
              {/**
               * @TODO Uncomment this when all UI is ready
               */}
              {marketStep === MarketSteps.params.id && <MarketInfo />}

              <MarketActionForm
                key={`market-form:simple`}
                className={cn(
                  marketStep === MarketSteps.params.id &&
                    "border-t border-divider"
                )}
              />

              <div
                className={cn(
                  "flex-0",
                  "flex w-full shrink-0 flex-row items-center justify-between border-t border-divider",
                  BASE_PADDING_LEFT,
                  BASE_PADDING_RIGHT,
                  "py-3"
                )}
              >
                <div className="font-gt text-sm font-light text-secondary">
                  Advanced Mode
                </div>
                <Switch
                  checked={viewType === MarketViewType.advanced.id}
                  onCheckedChange={() => {
                    setViewType(
                      viewType === MarketViewType.advanced.id
                        ? MarketViewType.simple.id
                        : MarketViewType.advanced.id
                    );
                  }}
                />
              </div>
            </Fragment>
          ) : (
            // <MarketForm />
            <Fragment>
              {/**
               * @info Left section
               */}
              <div
                className={cn(
                  "flex h-full shrink-0 flex-col divide-y divide-divider",
                  "w-full md:w-[50%] xl:w-[25%]"
                )}
              >
                <MarketInfo />

                <IncentiveInfo />

                <OfferList />
              </div>

              {/**
               * @info Middle section
               */}
              <div
                className={cn(
                  "border-t border-divider md:border-t-0",
                  "h-full shrink-0 flex-col divide-y divide-divider md:hidden xl:flex",
                  "w-full md:w-[40%] xl:w-[50%]",
                  "flex h-full grow flex-col",
                  MAX_SCREEN_WIDTH
                )}
              >
                <OfferListVisualizer className="h-1/2 w-full" />

                <StatsTables className="flex h-[18rem] w-full flex-col overflow-hidden xl:h-1/2" />
              </div>

              {/**
               * @info Right section
               */}
              <div
                className={cn(
                  "border-t border-divider md:border-t-0",
                  "flex h-full shrink-0 flex-col divide-y divide-divider",
                  "w-full md:w-[50%] xl:w-[25%]"
                )}
              >
                <BalanceIndicator />

                <MarketActionForm />
              </div>
            </Fragment>
          )}
        </motion.div>
      </Fragment>
    );
  }
});
