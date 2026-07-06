# ISQ Brasil — Guia de Motion, Tokens & Efeitos

Fonte única para animação, transições de seção e micro-interações. Gerado a
partir da skill `ui-ux-pro-max` (regras de UX/animação/performance) + skill
`frontend-design`, **ancorado na identidade já existente do site** (não nos
defaults genéricos da ferramenta).

> A ferramenta validou a direção: padrão "Enterprise Gateway", estilo "Trust &
> Authority", base navy. Mantemos a marca real (navy `#0b1623` + acento
> vermelho `#d60000` + aço; Fraunces + Inter) — não trocamos por Lexend/azul.

---

## 1. Princípios (o "porquê")

1. **Gaste a ousadia num lugar só.** 1–2 elementos animados por tela, no
   máximo. O herói é o showpiece 3D; cada seção tem **um** gesto de transição,
   não tudo se mexendo. (frontend-design + UX "excessive motion").
2. **Easing com intenção.** `ease-out` para entrar, `ease-in` para sair, scrub
   para atravessar. Nunca `linear` em UI.
3. **Duração calibrada.** Micro-interação 150–300ms; reveal 600–950ms;
   orquestração de scroll é dirigida pelo scroll (sem teto de 500ms).
4. **Só `transform` e `opacity`.** São compostas na GPU. Nada de animar
   `width/height/top/left`. `will-change` com parcimônia.
5. **Reduced-motion é requisito (severidade alta).** Todo efeito novo degrada
   para opacidade/instantâneo sob `prefers-reduced-motion: reduce`.
6. **A assinatura amarra tudo.** O motivo visual é a *linha de varredura*
   (eco do anel vermelho do Hero) e as *hairlines técnicas*. Transições usam
   esse vocabulário, não fades genéricos.

---

## 2. Tokens

### Easing (control points)
| Token | Bézier | Uso |
|-------|--------|-----|
| `--ease-isq` / `EASE.out` | `0.22, 1, 0.36, 1` | entradas, reveals |
| `--ease-isq-in` / `EASE.in` | `0.7, 0, 0.84, 0` | saídas |
| `--ease-isq-inout` / `EASE.inOut` | `0.65, 0, 0.35, 1` | scrub, atravessar |
| `EASE.curtain` | `0.76, 0, 0.24, 1` | clip/curtain reveals |

### Duração (`DUR` em s · CSS var em ms)
| Token | Valor | Uso |
|-------|-------|-----|
| `micro` | 0.18s | hover, tap, cursor |
| `fast` | 0.30s | toggles, troca de estado |
| `reveal` | 0.70s | entrada de conteúdo em viewport |
| `slow` | 1.10s | reveals de seção, leques |
| `hero` | 1.40s | orquestração de page-load |

`STAGGER = 0.1s` · `--reveal-y = 1.25rem`

### Z-index (escala — evita guerra de `9999`)
`base 0` · `raised 10` (cards) · `sticky 40` · `header 50` · `overlay 90` ·
`intro 100`. Lembrar: todo `transform`/`opacity<1`/`filter` cria stacking
context novo.

---

## 3. Vocabulário de transição entre seções (Fase 2)

Um gesto por fronteira, do mesmo idioma técnico:

- **Scan-line divider.** A hairline do topo da seção é "desenhada"
  (`scaleX` 0→1, origem à esquerda) em vermelho→navy quando a seção entra —
  eco do anel de varredura do Hero. Substitui a hairline estática atual.
- **Clip-reveal de profundidade.** O conteúdo da seção sobe com
  `clipPath inset()` + `y` pequeno, dando sensação de camada que emerge.
- **Hand-off de profundidade.** Seção que sai recua sutilmente (`y` + `opacity`
  via scroll), a que entra sobe — leitura de planos em z, só transform/opacity.

Fallback reduced-motion: hairline aparece em opacidade, conteúdo sem `y`/clip.

---

## 4. Micro-interações 3D (Fase 3)

- **Tilt** ([`src/components/ui/Tilt.tsx`](../src/components/ui/Tilt.tsx)) — já
  nos painéis de Frentes. Rollout: Pillars (compõe com o leque), Clients,
  Stats. Adicionar parallax de profundidade com `translateZ` (pai
  `transform-style: preserve-3d`).
- **Regras:** desliga em `pointer: coarse` e reduced-motion; `cursor-pointer`
  em tudo clicável; feedback de hover por cor/sombra (não por `scale` que
  empurra o layout).

---

## 5. Checklist pré-entrega (de cada efeito)
- [ ] Só `transform`/`opacity`
- [ ] `prefers-reduced-motion` tratado
- [ ] Duração dentro da escala
- [ ] 1–2 elementos animados por tela
- [ ] Sem layout shift no hover
- [ ] Focus visível preservado
