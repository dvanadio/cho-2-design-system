# CHO 2.0 Design System

## Objetivo

Sistema visual para um SaaS B2B de Higiene Ocupacional com foco em:

- análise técnica de agentes ocupacionais;
- PRHO;
- pré-orçamento e orçamento;
- amostragem;
- importação de laudos;
- memória de campo;
- relatórios finais.

Direção adotada:

- técnico;
- confiável;
- limpo;
- corporativo;
- moderno;
- denso sem parecer pesado;
- premium funcional, sem estética genérica de IA.

Referência visual base: site atual do Canal HO. Tokens principais herdados ou derivados da identidade atual observada:

- `#003349` azul institucional;
- `#FF6D00` laranja institucional;
- `#05CAB6` teal técnico;
- `#FFFFFF` branco;
- neutros frios para superfícies, bordas e tabelas.

## 1. Fundamentos visuais

### Paleta principal

| Token | Valor | Uso |
|---|---:|---|
| `brand.navy.800` | `#003349` | sidebar, headers, ações secundárias, contraste alto |
| `brand.navy.900` | `#02283A` | superfícies densas, hero, painéis premium |
| `brand.blue.700` | `#0F5F7A` | links, filtros ativos, revisão técnica |
| `brand.blue.500` | `#2D82B7` | foco, info, estados de navegação |
| `brand.cyan.500` | `#05CAB6` | confirmação técnica, extração, assistido |
| `brand.orange.500` | `#FF6D00` | CTA, ação primária, status de progresso |

### Paleta secundária

| Token | Valor | Uso |
|---|---:|---|
| `sky.100` | `#B6E5FF` | info leve, contexto de revisão |
| `cyan.100` | `#DFF7F4` | fundo de badges assistivos |
| `orange.100` | `#FFE5D0` | destaque leve e pré-ação |
| `positive.100` | `#D8F5EB` | fundo de sucesso |
| `warning.100` | `#FFF1E0` | fundo de alerta |
| `danger.100` | `#FBE3E3` | erro leve |
| `critical.100` | `#F6DEE1` | risco crítico |

### Superfícies

| Token | Valor |
|---|---:|
| `bg.page` | `#EEF3F5` |
| `bg.canvas` | `#F7FAFB` |
| `bg.panel` | `#FFFFFF` |
| `bg.panel.strong` | `#F4F7F8` |

### Texto

| Token | Valor |
|---|---:|
| `text.strong` | `#102A3A` |
| `text.default` | `#2F4858` |
| `text.soft` | `#617788` |
| `text.inverse` | `#FFFFFF` |

### Borda

| Token | Valor |
|---|---:|
| `border.subtle` | `#D7E0E6` |
| `border.strong` | `#B7C8D3` |
| `border.focus` | `#2D82B7` |

### Estados

| Estado | Cor principal | Uso |
|---|---:|---|
| success | `#0C9B7A` | aprovado, concluído, validado |
| warning | `#D98324` | atenção, pendência, checagem |
| error | `#C74B4B` | falha, rejeição, inconsistência |
| info | `#2D82B7` | ajuda, revisão, dados interpretados |
| critical | `#8E2F39` | criticidade alta, ação imediata |

### Criticidade

| Nível | Tratamento |
|---|---|
| Baixa | neutro com leve azul |
| Moderada | amarelo técnico / warning |
| Alta | vermelho controlado |
| Crítica | vinho profundo |
| Não classificado | cinza frio |

### Status de análise

| Status | Cor |
|---|---|
| Aguardando documentos | neutro |
| Processando | azul técnico + laranja de progresso |
| Extração concluída | teal |
| Revisão necessária | azul informativo |
| Aprovado | verde |
| Gerado orçamento | azul institucional |
| Em amostragem | laranja técnico |
| Relatório finalizado | verde escuro |

### Modo claro

Modo claro é o padrão do sistema.

- contraste principal em superfícies brancas;
- tabelas com listras muito sutis;
- áreas de revisão com cinza-azulado claro;
- destaque por cor sempre apoiado por texto e badge.

### Tokens de escala

| Categoria | Escala |
|---|---|
| spacing | `4, 8, 12, 16, 24, 32, 40, 56, 72` |
| radius | `8, 12, 16, 24, pill` |
| shadow | `sm, md, lg, focus-ring` |
| border | `1px subtle, 1px strong, 2px emphasis` |
| opacity | `16, 40, 64, 88, 100` |

## 2. Tipografia

Famílias:

- primária: `Instrument Sans`;
- técnica monoespaçada: `IBM Plex Mono`.

Escala:

| Estilo | Tamanho / linha | Peso | Uso |
|---|---|---:|---|
| display | `48 / 56` | 700 | capas, hero, chamadas |
| h1 | `36 / 44` | 700 | páginas principais |
| h2 | `28 / 36` | 600 | seções |
| h3 | `22 / 30` | 600 | cards e blocos |
| h4 | `18 / 26` | 600 | cabeçalhos compactos |
| body | `16 / 26` | 400 | conteúdo principal |
| body small | `14 / 22` | 400 | suporte e metadata |
| label | `12 / 16` | 600 | campos e filtros |
| helper text | `12 / 18` | 400 | orientação |
| table header | `12 / 16` | 600 | cabeçalho de grid |
| table cell | `14 / 20` | 400 | tabelas |
| badge text | `14 / 16` | 600 | chips e indicadores |
| button text | `14 / 16` | 600 | ações |
| technical note | `12 / 18` | 500 | CAS, TWA, logs, rastreio |

## 3. Layout

| Contexto | Regra |
|---|---|
| desktop | 12 colunas, gutter 24px, container 1440px |
| tablet | 8 colunas, gutter 20px |
| mobile | 4 colunas, gutter 16px |
| sidebar | 272px fixa em desktop, recolhível em tablet |
| topbar | contexto + ações + filtros rápidos |
| página interna | header contextual, conteúdo principal e rail opcional |
| formulário | duas colunas em desktop, uma em mobile |
| dashboard | faixas de KPI, cards operacionais, grids de atividade |
| tabela | cabeçalho sticky opcional, filtro e paginação próximos |
| revisão técnica | comparador 2 colunas, decisão lateral fixa |
| relatório | composição limpa, respiro maior e blocos de evidência |

## 4. Componentes básicos

### Ações

- botões primários: laranja institucional;
- secundários: azul institucional cheio;
- terciários: fundo neutro com borda;
- destrutivos: vermelho leve com borda;
- botão com ícone: 44x44 mínimo.

Estados obrigatórios em todos:

- default;
- hover;
- active;
- focus;
- disabled;
- error;
- success;
- loading.

### Formulários

- inputs, selects e textareas com 44px mínimo;
- borda sutil por padrão;
- foco azul técnico com ring visível;
- checkbox e radio desenhados, sem depender do scale do browser;
- switch com trilho limpo e knob estável;
- mensagens de erro abaixo do campo;
- sucesso só quando agrega clareza, não em excesso.

### Navegação

- menu horizontal com item ativo em superfície clara;
- sidebar com contraste institucional e item ativo discreto;
- tabs compactas com destaque sólido claro;
- breadcrumbs discretos;
- paginação com chips de 36px;
- dropdowns e filtros em superfícies claras;
- tooltips pequenos, sem excesso visual.

### Conteúdo

- cards com borda suave e sombra curta;
- accordions para detalhes densos;
- modais para decisão crítica;
- drawers para edição lateral;
- chat assistido com bolhas sóbrias e sem estética de app social;
- alerts inline;
- toasts breves no canto superior direito;
- empty states orientados à próxima ação;
- skeleton com shimmer sutil;
- progress bar para lote/processamento;
- stepper para fluxos longos;
- table e data grid como blocos centrais do produto;
- tags e badges como semântica rápida.

## 5. Componentes específicos para Higiene Ocupacional

Componentes previstos no showcase:

- Card de Cliente;
- Card de Análise PRHO;
- Card de Agente Ocupacional;
- Badge NR-15;
- Badge eSocial;
- Badge LINACH;
- Badge CAS;
- Badge TWA;
- Badge Quantificar;
- Badge Não Quantificar;
- Badge de Criticidade;
- Indicador de confiança da extração;
- Bloco de Justificativa Técnica;
- Bloco de Recomendação Técnica;
- Comparador Documento original x dado extraído;
- Componente de revisão humana;
- Timeline da análise;
- Status da análise;
- Upload de FISPQ/FDS;
- Upload de laudo laboratorial;
- Upload de planilha;
- Checklist técnico;
- Tabela de agentes extraídos;
- Tabela de amostragens;
- Card de resultado laboratorial;
- Card de relatório final.

## 6. Linguagem visual para IA

Princípio: IA assistiva, nunca protagonista.

Termos aprovados:

- assistido;
- sugestão;
- extração automática;
- revisão necessária;
- confiança da extração;
- dados interpretados;
- recomendação técnica;
- aguardando validação.

Termos rejeitados:

- magia;
- robô;
- super IA;
- resposta mágica;
- futurista;
- neural;
- cyber.

Tratamento visual:

- badges neutras ou teal;
- textos de apoio em azul técnico;
- indicadores de confiança com barra e percentual;
- decisão final sempre associada a ação humana explícita.

## 7. Status e criticidade

### Processamento

- Aguardando documentos
- Processando
- Extração concluída
- Revisão necessária
- Aprovado
- Gerado orçamento
- Em amostragem
- Relatório finalizado

### Decisão técnica

- Quantificar
- Não quantificar
- Avaliação manual necessária
- Dados insuficientes

### Criticidade

- Baixa
- Moderada
- Alta
- Crítica
- Não classificado

## 8. Telas de exemplo

Modeladas no showcase:

- Login
- Dashboard
- Listagem de clientes
- Detalhe do cliente
- Nova análise PRHO
- Upload de documentos
- Processamento da análise
- Revisão de agentes extraídos
- Classificação técnica
- Pré-orçamento
- Orçamento
- Amostragem
- Importação de laudo
- Relatório final
- Configurações
- Usuários e permissões
- Planos SaaS

## 9. Direção estética

Pilares visuais:

- fundo claro;
- cards brancos;
- bordas suaves;
- sombras discretas;
- sidebar elegante em azul institucional;
- laranja como ação;
- teal como apoio técnico e positivo;
- ritmo visual sóbrio, sem gradientes chamativos nem linguagem de IA genérica.

## Artefatos entregues

- [Showcase HTML](/Users/davivanadio/Documents/CHO%202.0/index.html)
- [Folha de estilos / tokens](/Users/davivanadio/Documents/CHO%202.0/styles.css)
- [Especificação Markdown](/Users/davivanadio/Documents/CHO%202.0/DESIGN_SYSTEM_CHO_2_0.md)
