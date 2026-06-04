/**
 * IntroBuffer — seção "fantasma" no topo da página.
 *
 * Espaço vazio de 100vh que existe apenas para servir de runway
 * vertical durante o fade do IntroScreen. Não tem conteúdo, não
 * captura cliques, não aparece para leitores de tela. Apenas ocupa
 * altura suficiente pra que o fade da intro aconteça INTEIRAMENTE
 * antes do usuário alcançar a primeira seção de conteúdo.
 *
 * Mecânica:
 *  - Buffer h-screen (100vh) no topo do <main>.
 *  - IntroScreen mede window.innerHeight e ata o fade ao range
 *    [0, vh] de scrollY — exatamente o tamanho do buffer.
 *  - Quando o usuário scrolla o buffer inteiro, a intro vira
 *    transparente e a Hero (próxima seção) aparece no topo da
 *    viewport sem qualquer sobreposição.
 *  - O usuário pode interagir livremente com a Hero a partir desse
 *    ponto — pode rolar de volta pra "ver" a intro novamente se
 *    quiser, ou seguir adiante para Manifesto/Pilares/etc.
 *
 * Server component (sem JS no cliente) porque só ocupa espaço.
 */
export default function IntroBuffer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none h-screen w-full"
    />
  );
}
