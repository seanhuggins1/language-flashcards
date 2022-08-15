import { Box, Tooltip, TooltipProps } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";

interface CustomTooltipProps extends TooltipProps {
  readonly children: ReactNode;
}

const CustomTooltip = ({ children, ...tooltipProps }: CustomTooltipProps) => (
  <Tooltip bg="gray.900" borderRadius={8} p={2} {...tooltipProps}>
    {children}
  </Tooltip>
);

export default CustomTooltip;
