# Evidências de utilização · Bug Hunters

Revisão das 10 gravações da pasta Bug Hunters - QA no Drive do Edilson. Interface pública e administrativa; distinta da API restful-booker.herokuapp.com.

21/10/2026, inferida exclusivamente do nome dos arquivos; build e relógio do ambiente não confirmados.

Inspeção visual por quadros, sequência das ações e comparação antes/depois. Sem nova execução contra a aplicação. Classificação restrita ao que as gravações demonstram.

## Resultado da revisão

10 gravações: 3 bugs observados, 6 ocorrências em análise e 1 controle sem falha visual. Navegação usa critérios de usabilidade explicitamente adotados; o cenário de cliques repetidos segue o esclarecimento do executor. Esses critérios não foram atribuídos ao PDF.

Todos os vídeos são curtos (4 a 26 segundos) e foram mantidos integrais para preservar ação e resultado. Os originais permanecem no Drive. Legendas são descrições editoriais, não transcrição de fala.

## Limites de cobertura

Não há execução de login com credenciais nesta rodada; apenas uma tela de login no final de UI-010. A exclusão UI-007 é de quarto, não de reserva. Status HTTP, causas técnicas, persistência após recarga e cobertura completa do sistema não podem ser inferidos dos vídeos.

## UI-001 · Menu Comodidades sem destino visível

**Classificação:** Bug observado · **Criticidade sugerida:** Baixa · **Área:** Navegação

**Regra:** Critério de usabilidade adotado na revisão; sem CA específico no case.

### Cenário e execução

1. Abrir a página pública e chegar à disponibilidade.
2. Acionar Comodidades/Amenities no menu superior.
3. Observar a posição da página e repetir após a recarga mostrada.

```gherkin
Cenário: Menu Comodidades sem destino visível
  Dado que a interface está na área de navegação
  Quando executo a ação descrita: Acionar Comodidades/Amenities no menu superior.
  Então observo na gravação: As tentativas em Comodidades mantêm a tela na área de disponibilidade e quartos. A recarga intermediária retorna ao topo; a tentativa é repetida.
```

**Esperado:** O link deve levar à seção de comodidades ou apresentar um destino válido.

**Obtido:** As tentativas em Comodidades mantêm a tela na área de disponibilidade e quartos. A recarga intermediária retorna ao topo; a tentativa é repetida.

**Por que / análise:** Um item de navegação oferece uma ação que não produz o destino anunciado durante a gravação.

**Limite e próximo reteste:** A causa não foi inspecionada no código. A tradução do navegador alterna os rótulos; não foi classificada como bug de idioma.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 19.54.42.mp4](https://drive.google.com/file/d/1bdo5lxyxQ-2U1xsDnnxpquH7UjfpgjmE/view?usp=drivesdk)
- Vídeo publicado: [UI-001](assets/videos/ui-001.mp4) · 13.37s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `d6f0338bf14559398c5be343fa295e32ff37571fc1d15fa4a5ad61d7ea95ffb2`
- SHA-256 publicado: `7b4101c235132910f3e65bbd40c4db7e6d5a81a721eb4ccac3bcece0245ad810`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–4.3s | Tentativas no link Comodidades; a seção de disponibilidade permanece visível. |
| 5.5–9.4s | Após a recarga, a página retorna ao topo e à disponibilidade. |
| 10.0–13.3s | Nova tentativa em Comodidades sem destino visível. |

## UI-002 · Contato após mensagem enviada

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Contato / rodapé

**Regra:** UC05 é contexto do fluxo; nenhum CA violado foi comprovado nesta gravação.

### Cenário e execução

1. Partir da confirmação de mensagem enviada.
2. Acionar os links rápidos do rodapé.
3. Verificar retorno ao topo, quartos e seção de contato.

```gherkin
Cenário: Contato após mensagem enviada
  Dado que a interface está na área de contato / rodapé
  Quando executo a ação descrita: Acionar os links rápidos do rodapé.
  Então observo na gravação: A tela já começa na confirmação de contato. Há navegação para o topo/quartos e retorno à confirmação; não aparece um novo formulário.
```

**Esperado:** Os links do rodapé devem levar às suas seções. A possibilidade de iniciar uma segunda mensagem precisa de regra definida.

**Obtido:** A tela já começa na confirmação de contato. Há navegação para o topo/quartos e retorno à confirmação; não aparece um novo formulário.

**Por que / análise:** A confirmação continuar visível não demonstra, sozinha, uma falha de navegação ou perda da mensagem.

**Limite e próximo reteste:** O envio e os dados usados não constam neste vídeo. Não há evidência de validação de e-mail, telefone ou nova tentativa de envio.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 19.59.21.mp4](https://drive.google.com/file/d/1Vud4sF3BQ824gfBqMBzOaHOQh0BtJ0eD/view?usp=drivesdk)
- Vídeo publicado: [UI-002](assets/videos/ui-002.mp4) · 16.90s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `b9ba18c0e1f36ed123579007414de18420286b5aa1a35e2542c1644c6aabcce6`
- SHA-256 publicado: `b3baab751a1c4d23e98254450d7228a914ccddc77d833fbde4c3810a551dd933`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–4.7s | A gravação começa com a confirmação de contato já exibida. |
| 5.0–10.2s | Os links levam ao topo e à região de quartos. |
| 10.3–16.8s | A seção de contato continua exibindo a confirmação anterior. |

## UI-003 · Entrada de datas com ano 0002

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Disponibilidade

**Regra:** UC02 / CA3 e CA4; aceitação final não demonstrada.

### Cenário e execução

1. Abrir Check Availability.
2. Editar manualmente os campos, incluindo texto e ano com poucos dígitos.
3. Tentar concluir a consulta e registrar a validação em um reteste.

```gherkin
Cenário: Entrada de datas com ano 0002
  Dado que a interface está na área de disponibilidade
  Quando executo a ação descrita: Editar manualmente os campos, incluindo texto e ano com poucos dígitos.
  Então observo na gravação: São digitados caracteres nos campos e o checkout termina em 22/10/0002. O calendário acompanha o ano 0002, sem resultado de reserva demonstrado.
```

**Esperado:** Datas inválidas e períodos retroativos devem ser validados antes de aceitar um agendamento.

**Obtido:** São digitados caracteres nos campos e o checkout termina em 22/10/0002. O calendário acompanha o ano 0002, sem resultado de reserva demonstrado.

**Por que / análise:** A edição do campo indica um cenário negativo útil, mas não prova que uma reserva ou consulta foi aceita com esses dados.

**Limite e próximo reteste:** Falta uma submissão inequívoca seguida da resposta. Não foi registrado como bug confirmado de reserva retroativa.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.03.14.mp4](https://drive.google.com/file/d/1r2c9nTG3F41bTDSmlXFOHxslOtCpeOer/view?usp=drivesdk)
- Vídeo publicado: [UI-003](assets/videos/ui-003.mp4) · 15.77s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `83fc6a41d7ee61be7aaece82d947f72146a5460d38d0339d232f9ca2dc58b664`
- SHA-256 publicado: `53df9411e50cac6cc614d99928b8da38ec62faf4b773ab4a82477cc6c6b0d77a`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–4.8s | Edição manual dos campos de check-in e checkout. |
| 5.0–11.9s | Tentativas de inserir caracteres e alterar o ano. |
| 12.0–15.7s | Checkout exibe 22/10/0002 e o calendário acompanha o ano. |

## UI-004 · Breadcrumb Rooms não navega

**Classificação:** Bug observado · **Criticidade sugerida:** Baixa · **Área:** Detalhe do quarto

**Regra:** Critério de usabilidade adotado na revisão; sem CA específico no case.

### Cenário e execução

1. Abrir o detalhe de Single Room.
2. Acionar Rooms no breadcrumb e observar a tela.
3. Usar Home como controle, reabrir o quarto e repetir Rooms.

```gherkin
Cenário: Breadcrumb Rooms não navega
  Dado que a interface está na área de detalhe do quarto
  Quando executo a ação descrita: Acionar Rooms no breadcrumb e observar a tela.
  Então observo na gravação: As tentativas em Rooms mantêm o detalhe do Single Room. O link Home funciona como controle de navegação e o quarto é aberto novamente.
```

**Esperado:** O link Rooms no breadcrumb deve retornar à listagem de quartos.

**Obtido:** As tentativas em Rooms mantêm o detalhe do Single Room. O link Home funciona como controle de navegação e o quarto é aberto novamente.

**Por que / análise:** O caminho de retorno oferecido pela interface não conclui a navegação esperada.

**Limite e próximo reteste:** Falha observada na interface da gravação; destino HTML e causa técnica não foram inspecionados.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.12.10.mp4](https://drive.google.com/file/d/1QQi_tTq_j1N5bV_VpkttBgzEeE0mUCmD/view?usp=drivesdk)
- Vídeo publicado: [UI-004](assets/videos/ui-004.mp4) · 23.83s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `3fe5b393c3142317909f5e26f0e9798a6d14c04b86ca131f491b7b84357b639e`
- SHA-256 publicado: `69db4eb127e6f7da2b54a14202c070eb59a2b65ef0586d012e3e992b287b703e`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–6.8s | Tentativas nos links do breadcrumb no detalhe do quarto. |
| 7.0–14.6s | Home retorna à página pública; o quarto é reaberto. |
| 15.0–23.7s | Novas tentativas em Rooms mantêm o detalhe visível. |

## UI-005 · Seleção de período passado no calendário

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Calendário de reserva

**Regra:** UC02 / CA3; bloquear o agendamento é o critério, não apenas o destaque visual.

### Cenário e execução

1. Abrir Suite Room e o calendário.
2. Navegar para setembro de 2026 e selecionar intervalos.
3. Em reteste, submeter com a data atual do ambiente registrada.

```gherkin
Cenário: Seleção de período passado no calendário
  Dado que a interface está na área de calendário de reserva
  Quando executo a ação descrita: Navegar para setembro de 2026 e selecionar intervalos.
  Então observo na gravação: O calendário de Suite Room permite destacar intervalos em setembro de 2026. A data sugerida pelos nomes dos arquivos é 21/10/2026.
```

**Esperado:** O sistema não deve aceitar agendamento retroativo; a seleção visual deve orientar o usuário sobre datas permitidas.

**Obtido:** O calendário de Suite Room permite destacar intervalos em setembro de 2026. A data sugerida pelos nomes dos arquivos é 21/10/2026.

**Por que / análise:** Selecionar um intervalo visual não equivale a concluir a reserva. É necessário verificar o bloqueio na submissão.

**Limite e próximo reteste:** Não há confirmação de reserva, relógio confiável do ambiente ou resposta da submissão. Não é prova de reserva retroativa criada.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.15.29.mp4](https://drive.google.com/file/d/1zq2896BkZGuQkE08Gq5kyMkxLfVapxbV/view?usp=drivesdk)
- Vídeo publicado: [UI-005](assets/videos/ui-005.mp4) · 26.37s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `51ccb67960bff67b970ba1d633c5b1f0df917135599c093f91efe1f6a1cbe391`
- SHA-256 publicado: `e5566d376545d0e5c3f6fed5f041ce05e73bbe0b758ba13dd8e9ee6cb2fa5771`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–6.5s | Calendário mostra setembro de 2026 e seleção de dias. |
| 7.0–18.5s | Outros intervalos são destacados visualmente. |
| 19.0–26.3s | A gravação termina no calendário, sem confirmação de reserva. |

## UI-006 · Cliques repetidos duplicam o cadastro

**Classificação:** Bug observado · **Criticidade sugerida:** Média · **Área:** Administração de quartos

**Regra:** Prevenção de envios duplicados na mesma operação, conforme esclarecimento do executor. Não se trata apenas de validar a unicidade do número do quarto.

### Cenário e execução

1. Preencher uma única vez o formulário de cadastro de quarto com os dados mostrados.
2. Dar duplo clique ou vários cliques rápidos em Create, sem aguardar a conclusão.
3. Conferir que a lista contém mais de uma linha referente à mesma intenção de criação.

```gherkin
Cenário: Cliques repetidos duplicam o cadastro
  Dado que preenchi uma única vez o formulário de cadastro de quarto
  Quando dou duplo clique ou vários cliques rápidos em Create
  Então observo mais de uma linha para a mesma intenção de criação
  E o esperado é concluir apenas uma criação, sem registros duplicados
```

**Esperado:** Uma única intenção de criação deve gerar apenas um registro, mesmo com duplo clique ou cliques rápidos em Create.

**Obtido:** Após cliques repetidos em Create, a lista apresenta duas linhas do quarto 102, Family, com preço 300, para o mesmo cadastro preenchido.

**Por que / análise:** O fluxo permite submissões repetidas durante a mesma operação, gerando registros duplicados em vez de concluir uma única criação.

**Limite e próximo reteste:** O executor esclareceu que o cenário é de duplo ou múltiplo clique em Create. O vídeo mostra cadastro de quartos na administração, não criação de reservas. Sem requisições e logs, a gravação não determina se a causa está na interface, no servidor ou em ambos.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.30.46.mp4](https://drive.google.com/file/d/1VnCP17R_3t--v7uSI34098F4tA91VpWP/view?usp=drivesdk)
- Vídeo publicado: [UI-006](assets/videos/ui-006.mp4) · 12.40s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `a02e9745f7fd480e38a0f32ddf34ccc0b08edd5e1a8a21460533bdb7450b8cc5`
- SHA-256 publicado: `0bc6b2dc65b245b7c7d57f1d17a969b58bda8bcdb7478368b9e0862858f8d3d5`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–3.5s | Um único formulário de cadastro está preenchido antes de Create. |
| 3.6–5.2s | Após a sequência de cliques em Create, são exibidas linhas duplicadas. |
| 5.3–12.3s | Duas linhas 102 permanecem visíveis para o mesmo cadastro. |

## UI-007 · Exclusão de quarto remove uma linha

**Classificação:** Controle sem falha observada · **Criticidade sugerida:** Não se aplica · **Área:** Administração de quartos

**Regra:** Controle visual de exclusão de quarto; não é o UC04 de exclusão de reservas.

### Cenário e execução

1. Identificar as duas linhas do quarto 102.
2. Acionar o ícone de exclusão da linha selecionada.
3. Conferir que uma linha desaparece.

```gherkin
Cenário: Exclusão de quarto remove uma linha
  Dado que a interface está na área de administração de quartos
  Quando executo a ação descrita: Acionar o ícone de exclusão da linha selecionada.
  Então observo na gravação: A gravação começa com 101 e dois quartos 102. Ao acionar a exclusão, uma das linhas 102 é removida; ao final restam 101 e 102.
```

**Esperado:** Ao excluir uma linha, ela deve desaparecer da lista exibida.

**Obtido:** A gravação começa com 101 e dois quartos 102. Ao acionar a exclusão, uma das linhas 102 é removida; ao final restam 101 e 102.

**Por que / análise:** O comportamento visível atende à remoção da linha. Não há evidência de falha de exclusão neste vídeo.

**Limite e próximo reteste:** É exclusão de quarto pela UI, não DELETE /booking da API anterior. Permanência da remoção após recarga e resposta HTTP não foram verificadas.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.31.42.mp4](https://drive.google.com/file/d/1a9EkqrvMZuLBmUEvYrsKBI6YvY5XMVbr/view?usp=drivesdk)
- Vídeo publicado: [UI-007](assets/videos/ui-007.mp4) · 4.40s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `88c456827fcd6dcd7102e00fd5dab88cf3d641adeafa3c0b117bcbf8df38f81b`
- SHA-256 publicado: `542c45b35ea4f4f765e1f30beaff088a90f889450d3f0fc20b3d7c4410260213`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–0.8s | A lista contém o quarto 101 e duas linhas 102. |
| 0.9–3.2s | O ícone de exclusão é acionado. |
| 3.3–4.3s | Ao final restam o quarto 101 e uma linha 102. |

## UI-008 · Reserva retorna Failed to create booking

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Agenda administrativa

**Regra:** UC02 / CA1 e CA3 como contexto; validade do cenário positivo não comprovada.

### Cenário e execução

1. Selecionar um intervalo no calendário administrativo.
2. Preencher os dados mostrados, escolher quarto 101 e pagamento true.
3. Acionar Book e registrar a mensagem exibida.

```gherkin
Cenário: Reserva retorna Failed to create booking
  Dado que a interface está na área de agenda administrativa
  Quando executo a ação descrita: Preencher os dados mostrados, escolher quarto 101 e pagamento true.
  Então observo na gravação: No calendário administrativo, são preenchidos nome, sobrenome, quarto 101 e pagamento. Ao acionar Book, aparece Failed to create booking.
```

**Esperado:** Uma reserva válida deve ser criada; dados recusados devem receber uma explicação que permita corrigir o problema.

**Obtido:** No calendário administrativo, são preenchidos nome, sobrenome, quarto 101 e pagamento. Ao acionar Book, aparece Failed to create booking.

**Por que / análise:** A mensagem de falha é demonstrada. O motivo da recusa e a validade integral dos dados não estão estabelecidos.

**Limite e próximo reteste:** O intervalo exibido é 16 a 18/10/2026, anterior à data sugerida pelo arquivo. Pode haver recusa por regra de datas. Não se pode concluir que um cadastro válido falhou.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.40.50.mp4](https://drive.google.com/file/d/1I9czsOfO6cynsgT2b5de52vAjGRHXmtn/view?usp=drivesdk)
- Vídeo publicado: [UI-008](assets/videos/ui-008.mp4) · 16.97s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `1555cffcacff7e3f5a8955f8755533b344c9f1f287c12ca763d13ad10193d41d`
- SHA-256 publicado: `f4311f7120265abf3cb5ecd68b7b7577f1eb02bf26a35d3b723a401de3823b1c`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–4.2s | Seleção no calendário abre o formulário administrativo. |
| 4.3–10.6s | Preenchimento de nome, sobrenome, quarto e pagamento. |
| 10.7–14.1s | Book resulta na mensagem Failed to create booking. |
| 14.2–16.9s | O formulário é cancelado e a agenda volta a aparecer. |

## UI-009 · Identificação do quarto aceita letras

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Edição de quarto

**Regra:** Formato do identificador de quarto: requisito a confirmar com o produto.

### Cenário e execução

1. Abrir o quarto 102 e acionar Edit.
2. Substituir Room por uma sequência de letras.
3. Acionar Update e conferir o detalhe e a lista.

```gherkin
Cenário: Identificação do quarto aceita letras
  Dado que a interface está na área de edição de quarto
  Quando executo a ação descrita: Substituir Room por uma sequência de letras.
  Então observo na gravação: O identificador exibido como 102 é substituído por letras. Após Update, o texto aparece no título do detalhe e na listagem administrativa.
```

**Esperado:** Se Room # for definido como numérico, a atualização deve recusar texto e orientar a correção.

**Obtido:** O identificador exibido como 102 é substituído por letras. Após Update, o texto aparece no título do detalhe e na listagem administrativa.

**Por que / análise:** A aceitação de texto é comprovada. A classificação como defeito depende de confirmar se Room # deve aceitar somente números ou códigos alfanuméricos.

**Limite e próximo reteste:** O case não define o formato do número de quarto. UC02/CA4 trata validação de tipos no fluxo de reserva; não foi imposto como contrato deste cadastro.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.45.16.mp4](https://drive.google.com/file/d/19A_xzCst6fg59uzUJJU-nn_6lWSwWDgC/view?usp=drivesdk)
- Vídeo publicado: [UI-009](assets/videos/ui-009.mp4) · 19.20s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `d61ce2d22dfdf0129c71118a9fd76b86472183950b35b0df9688e3aaacdeac44`
- SHA-256 publicado: `173759eceeca7ee0f8ed4e3b2faaa238e6d750c99bcca90ac62f55a76cb7cf44`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–3.2s | Detalhe do quarto 102 e abertura da edição. |
| 3.3–8.9s | Room é trocado por letras e Update é acionado. |
| 9.0–13.0s | O texto aparece no título do quarto. |
| 16.8–19.1s | A lista também mostra a identificação textual. |

## UI-010 · Interrupção durante edição de reserva

**Classificação:** Em análise · **Criticidade sugerida:** A avaliar · **Área:** Edição administrativa

**Regra:** UC01 e UC04 como contexto; mecanismo e causa da interrupção não determinados.

### Cenário e execução

1. No quarto 102, abrir a edição da reserva existente.
2. Observar a edição das datas e os controles da linha.
3. Registrar o erro de carregamento e a tela exibida após recarga.

```gherkin
Cenário: Interrupção durante edição de reserva
  Dado que a interface está na área de edição administrativa
  Quando executo a ação descrita: Observar a edição das datas e os controles da linha.
  Então observo na gravação: Após entrar na edição da reserva, aparece a tela This page could not load. Ao recarregar, é exibido o login administrativo.
```

**Esperado:** A edição deve manter a aplicação utilizável e informar claramente eventual necessidade de autenticação.

**Obtido:** Após entrar na edição da reserva, aparece a tela This page could not load. Ao recarregar, é exibido o login administrativo.

**Por que / análise:** A interrupção é visível; não há prova suficiente para atribuí-la ao salvamento da reserva ou a uma falha de autenticação.

**Limite e próximo reteste:** Não estão disponíveis logs de rede, motivo do erro de página, validade da sessão ou confirmação de salvamento. Não é bug confirmado de PUT ou de login.

### Rastreabilidade

- Fonte: [WhatsApp Video 2026-10-21 at 20.49.09.mp4](https://drive.google.com/file/d/1DAG27N5kweOr5N8S6exZ8FbsZzbLU47R/view?usp=drivesdk)
- Vídeo publicado: [UI-010](assets/videos/ui-010.mp4) · 9.17s
- Edição: Gravação integral, sem cortes, sem alteração de velocidade e sem sobreposição. Compressão H.264/AAC, resolução original, carregamento progressivo; legendas opcionais externas.
- SHA-256 do original: `665c584d48916f1ad7dcea1500bf805aa4f2954668fa9cf553654bc75bf6e416`
- SHA-256 publicado: `6b09a41e32edb48a7c65a95805858eb0832e6b3f87bc2064b7cfdd84b5e94345`

| Tempo no original e publicado | Evidência visível |
|---|---|
| 0.0–2.3s | Reserva existente e entrada no modo de edição. |
| 2.4–4.5s | Campos de data ficam editáveis. |
| 4.6–6.2s | É exibido This page could not load. |
| 6.3–9.1s | Após recarga, aparece o formulário de login. |
