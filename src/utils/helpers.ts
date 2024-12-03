/* eslint-disable prefer-const */
import {
    log,
    BigInt,
    BigDecimal,
    Address,
  } from "@graphprotocol/graph-ts";
  import { ERC20 } from "../../generated/Stream/ERC20";
  
  
  
  export let ZERO_BI = BigInt.fromI32(0);
  export let ONE_BI = BigInt.fromI32(1);
  export let ZERO_BD = BigDecimal.fromString("0");
  export let ONE_BD = BigDecimal.fromString("1");
  export let BI_18 = BigInt.fromI32(18);
  
  
  export function fetchTokenSymbol(tokenAddress: Address): string {
    let contract = ERC20.bind(tokenAddress);
  
    // try types string and bytes32 for symbol
    let symbolValue = "unknown";
    let symbolResult = contract.try_symbol();
    if (symbolResult.reverted) {
      log.error("ERC20.try_symbol reverted. address: {}", [
        tokenAddress.toHexString(),
      ]);
    } else {
      symbolValue = symbolResult.value;
    }
  
    return symbolValue;
  }
  
  export function fetchTokenName(tokenAddress: Address): string {
    let contract = ERC20.bind(tokenAddress);
  
    // try types string and bytes32 for name
    let nameValue = "unknown";
    let nameResult = contract.try_name();
    if (nameResult.reverted) {
      log.error("ERC20.try_name reverted. address: {}", [
        tokenAddress.toHexString(),
      ]);
    } else {
      nameValue = nameResult.value;
    }
  
    return nameValue;
  }
  
  export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    let contract = ERC20.bind(tokenAddress);
    // try types uint8 for decimals
    let decimalResult = contract.try_decimals();
    if (decimalResult.reverted) {
      log.error("ERC20.try_decimals reverted. address: {}", [
        tokenAddress.toHexString(),
      ]);
      return BigInt.fromI32(0);
    }
    return BigInt.fromI32(decimalResult.value);
  }
  
  export function fetchTokenBalance(
    tokenAddress: Address,
    user: Address
  ): BigInt {
    let contract = ERC20.bind(tokenAddress);
    let balanceResult = contract.try_balanceOf(user);
    if (balanceResult.reverted) {
      log.error("ERC20.try_balanceOf reverted. address: {}", [
        tokenAddress.toHexString(),
      ]);
      return BigInt.fromI32(0);
    }
  
    return balanceResult.value;
  }
  
  export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
    let bd = BigDecimal.fromString("1");
    for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
      bd = bd.times(BigDecimal.fromString("10"));
    }
    return bd;
  }
  
  export function bigDecimalExp18(): BigDecimal {
    return BigDecimal.fromString("1000000000000000000");
  }
  
  export function convertEthToDecimal(eth: BigInt): BigDecimal {
    return eth.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(18)));
  }
  
  export function convertTokenToDecimal(
    tokenAmount: BigInt,
    exchangeDecimals: BigInt
  ): BigDecimal {
    if (exchangeDecimals == ZERO_BI) {
      return tokenAmount.toBigDecimal();
    }
    return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
  }
  
  export function equalToZero(value: BigDecimal): boolean {
    const formattedVal = parseFloat(value.toString());
    const zero = parseFloat(ZERO_BD.toString());
    if (zero == formattedVal) {
      return true;
    }
    return false;
  }
  
  export function isNullEthValue(value: string): boolean {
    return (
      value ==
      "0x0000000000000000000000000000000000000000000000000000000000000001"
    );
  }
  