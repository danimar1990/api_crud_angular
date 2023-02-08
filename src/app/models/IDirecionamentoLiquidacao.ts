export interface IDirecionamentoLiquidacao {
  conta_b3: string;
  carteira: string;
  razao_social: string;
  direcionamento_liquidacao: Boolean;
}

export interface IDirecionamentoLiquidacaoTable {
  data: IDirecionamentoLiquidacao[];
  total_pagina: any;
  total_registro: any;
}
