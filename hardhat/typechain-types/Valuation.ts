/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface ValuationInterface extends Interface {
  getFunction(
    nameOrSignature: "getValuation" | "setValuation" | "valuations"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "ValuationSet"): EventFragment;

  encodeFunctionData(
    functionFragment: "getValuation",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setValuation",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "valuations",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getValuation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setValuation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "valuations", data: BytesLike): Result;
}

export namespace ValuationSetEvent {
  export type InputTuple = [
    contractAddress: AddressLike,
    tokenId: BigNumberish,
    value: BigNumberish
  ];
  export type OutputTuple = [
    contractAddress: string,
    tokenId: bigint,
    value: bigint
  ];
  export interface OutputObject {
    contractAddress: string;
    tokenId: bigint;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Valuation extends BaseContract {
  connect(runner?: ContractRunner | null): Valuation;
  waitForDeployment(): Promise<this>;

  interface: ValuationInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getValuation: TypedContractMethod<
    [contractAddress: AddressLike, tokenId: BigNumberish],
    [bigint],
    "view"
  >;

  setValuation: TypedContractMethod<
    [contractAddress: AddressLike, tokenId: BigNumberish, value: BigNumberish],
    [void],
    "nonpayable"
  >;

  valuations: TypedContractMethod<[arg0: BytesLike], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getValuation"
  ): TypedContractMethod<
    [contractAddress: AddressLike, tokenId: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "setValuation"
  ): TypedContractMethod<
    [contractAddress: AddressLike, tokenId: BigNumberish, value: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "valuations"
  ): TypedContractMethod<[arg0: BytesLike], [bigint], "view">;

  getEvent(
    key: "ValuationSet"
  ): TypedContractEvent<
    ValuationSetEvent.InputTuple,
    ValuationSetEvent.OutputTuple,
    ValuationSetEvent.OutputObject
  >;

  filters: {
    "ValuationSet(address,uint256,uint256)": TypedContractEvent<
      ValuationSetEvent.InputTuple,
      ValuationSetEvent.OutputTuple,
      ValuationSetEvent.OutputObject
    >;
    ValuationSet: TypedContractEvent<
      ValuationSetEvent.InputTuple,
      ValuationSetEvent.OutputTuple,
      ValuationSetEvent.OutputObject
    >;
  };
}
