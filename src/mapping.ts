import { ethereum, BigInt, log ,Address, BigDecimal, bigInt, store} from "@graphprotocol/graph-ts";

import {
  CreateStream as CreateStreamEvent,
  TokenRegister as TokenRegisterEvent,
  CloseStream  as CloseStreamEvent,
  ExtendStream as ExtendStreamEvent,
  ResumeStream as ResumeStreamEvent,
  PauseStream as PauseStreamEvent,
  WithdrawFromStream as WithdrawFromStreamEvent,
  SetNewRecipient as SetNewRecipientEvent
} from "../generated/Stream/Stream";

import { Stream, RegisteredTokenLog ,TokenRegister} from "../generated/schema";

import  { convertTokenToDecimal, fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./utils/helpers"


function createEventID(event: ethereum.Event): string {
  return event.block.number
    .toString()
    .concat("-")
    .concat(event.logIndex.toString());
}

export  function  handleCreateStream(ev: CreateStreamEvent): void {
 
  //token entity
  let token = TokenRegister.load(ev.params.tokenAddress.toHex())!;
  if(!token){
    log.error("[handleCreateStream] Token Does Not Exists{}",[ev.params.tokenAddress.toHex()]);
  }


  //locd existing stream entity
  let stream = Stream.load(ev.params.streamId.toHex());
  if(stream) {
    log.error("[handleCreateStream] Stream already exists {}",[ev.params.streamId.toHex()])
  }

  //convert from bigInt to decimals values 
  // let streamDeposit = convertTokenToDecimal(ev.params.deposit, token.decimals)
 
  let streamDeposit = convertTokenToDecimal(ev.params.deposit, token.decimals);
  let streamCliffAmount = convertTokenToDecimal(ev.params.cliffAmount, token.decimals);

  //create a new stream
  stream = new Stream(ev.params.streamId.toHex());
  stream.deposit = streamDeposit;
  stream.cliffAmount = streamCliffAmount;
  stream.cliffTime = ev.params.cliffTime;
  stream.startTime = ev.params.startTime;
  stream.stopTime = ev.params.stopTime;
  stream.interval  = ev.params.interval;
  stream.autoWithdraw = ev.params.autoWithdraw;
  stream.autoWithdrawInterval = ev.params.autoWithdrawInterval;


  //stream ratePerInterval  Calculation
  // formula: deposit / ((stopTime - startTime) / interval)
  

  stream.ratePerInterval = convertTokenToDecimal(ev.params.deposit.div(ev.params.stopTime.minus(ev.params.startTime).div(ev.params.interval)),
  token.decimals
)

stream.remainingBalance = streamDeposit;
stream.createAt = ev.block.timestamp;
stream.remainingBalance = stream.remainingBalance.minus(streamCliffAmount);
stream.lastWithdrawTime = ev.params.startTime;
stream.closed = false;
stream.isPaused = false;


//to be calculated for
stream.withdrawnBalance = BigDecimal.fromString("0");
stream.pauseAt = BigInt.fromI32(0);
stream.pauseBy = Address.zero();
stream.accPauseTime = BigInt.fromI32(0);
stream.feeBalance =BigDecimal.fromString("0");


//cliff vesting logic 
if(ev.block.timestamp >= ev.params.cliffTime || ev.params.cliffAmount == BigInt.fromI32(0)){
  stream.cliffDone = true;
  let fee = streamCliffAmount.times(token.feeRate)
} else{
  stream.cliffDone = false;
}






stream.save();

}



export  function  handleTokenRegister(ev: TokenRegisterEvent):void{
  //token Information 
  let tokenName = fetchTokenName(ev.params.tokenAddress);
  let tokenSymbol = fetchTokenSymbol(ev.params.tokenAddress);
  let tokenDecimals = fetchTokenDecimals(ev.params.tokenAddress);

  //load token entity
  let token = TokenRegister.load(ev.params.tokenAddress.toHex());
  if(token){
    log.error("[handleTokenRegister] TokenRegister already exist {}", [ev.params.tokenAddress.toHex()]);
    return;
  }

  token = new TokenRegister(ev.params.tokenAddress.toHex());
  token.name = tokenName;
  token.symbol = tokenSymbol;
  token.decimals = tokenDecimals;
  token.feeRate = convertTokenToDecimal(ev.params.feeRate , BigInt.fromI32(4));

  token.withdrawnBalance = BigDecimal.fromString("0");
  token.feeBalance = BigDecimal.fromString("0");
  token.remainingBalance = BigDecimal.fromString("0");



  token.save();

}


export function handleExtend(ev:ExtendStreamEvent):void{

}



export function handleWithdraw(ev:WithdrawFromStreamEvent):void{
}


export function handleClose(ev:CloseStreamEvent):void{

}

export function handlePause(ev:PauseStreamEvent):void{
}

export function handleResume(ev:ResumeStreamEvent):void{


}

export function handleSetNewRecipient(ev:SetNewRecipientEvent):void{
  
}

