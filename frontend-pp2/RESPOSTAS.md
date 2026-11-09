# Respostas – Lista de exercícios (Biblioteca)

## Exercício 1 – Resultados reais da API (`node exercicio1.mjs`)

| Situação | Status | Mensagem |
|---|---|---|
| POST /genres sem `name` | 400 | Nome é obrigatório |
| POST /books sem `title` | 400 | Título é obrigatório |
| POST /books com title e sem `author` | 400 | Autor é obrigatório |
| POST /books com `pages` = -5 | 400 | Número de páginas inválido |
| POST /books com `genreId` 999 | 404 | Gênero não encontrado |
| GET /books/abc | 400 | Id inválido |
| DELETE /books/1 (1ª vez / 2ª vez) | 204 / 404 | (sem corpo) / Livro não encontrado |
| POST /books sem `Content-Type` | 500 | Erro interno |

**Por que o último é 500 e não 400?** Sem `Content-Type: application/json` o Express não
interpreta o corpo, então `req.body` fica `undefined`. Ao acessar `req.body.title` o código
lança um `TypeError` inesperado, que não é um `AppError` de validação; o `errorHandler` o trata
como falha interna (500). É um erro não previsto pelo servidor, não uma validação.

## Exercício 8 – SET NULL

Ao apagar um gênero, os livros continuam na lista, sem gênero, e `genreId` fica `NULL` no banco
(`ON DELETE SET NULL`).

**Por que recarregar o select ao trocar de aba?** A lista de gêneros de `Livros` é um state local
carregado no `useEffect`. Gêneros criados, renomeados ou apagados na outra aba não chegam a ele.
Como cada aba é desmontada ao trocar, ao voltar `Livros` monta de novo e busca livros e gêneros
atualizados.

## Desafios feitos

D1 (filtro por gênero), D2 (busca por título com "N de M"), D3 (progresso de leitura),
D4 (ordenação), D5 (editar páginas e gênero) e D6 (confirmação + aviso "Livro removido").

## Perguntas de revisão

1. **Fetch solto no corpo?** O corpo roda a cada render. O fetch faria `setState`, que gera novo
   render, que repete o fetch: loop infinito de requisições. O `useEffect` controla quando roda.
2. **Dependências:** `[]` roda uma vez após a montagem; `[x]` roda na montagem e sempre que `x`
   mudar; sem array roda após todo render.
3. **404/500 lançam erro?** Não. O `fetch` só rejeita em falha de rede. Verifica-se
   `resposta.ok` (ou `status`) e lança-se o erro manualmente.
4. **`JSON.stringify` e `Content-Type`:** `stringify` converte o objeto em texto JSON (o body
   precisa ser string); o cabeçalho avisa o servidor que o texto é JSON. Sem `stringify` o body vira
   `"[object Object]"`; sem o cabeçalho o servidor não lê o corpo (500 nesta API).
5. **DELETE:** responde 204 sem corpo; `.json()` falharia com "Unexpected end of JSON input".
6. **`[...atual, novo]` e não `push`:** o React compara por referência. `push` altera o mesmo
   array, a referência não muda e a tela pode não atualizar. Além disso, state não deve ser mutado.
7. **Atualizar só após sucesso:** a tela só reflete o que realmente foi gravado. Se a API recusar
   (400/404), o state não fica diferente do banco.
8. **Quem cria o id?** O banco (autoincrement). O frontend o conhece porque o POST devolve o livro
   criado, com o `id`.
