# Pill.it

Pill.it é uma aplicação web instalável para ajudar no acompanhamento diário de
pílulas e ciclos de tomada.

## Sobre o projeto

O projeto nasceu de uma necessidade pessoal e comum: às vezes esqueço de tomar
minhas pílulas e queria uma forma simples de visualizar a rotina, registrar cada
tomada e reduzir dúvidas no dia a dia.

Além de resolver um problema real, o Pill.it é um projeto de aprendizado voltado
à construção de um produto completo, seguro e fácil de manter. A proposta inclui
o acompanhamento de ciclos e cartelas, histórico de registros e compartilhamento
opcional com uma pessoa de confiança.

> O Pill.it é uma ferramenta de apoio à organização. Ele não oferece diagnóstico,
> prescrição ou orientação sobre o que fazer em caso de uma dose esquecida.

## Tecnologias planejadas

- Next.js, React e TypeScript
- Tailwind CSS, shadcn/ui e Radix UI
- Supabase, PostgreSQL, Row Level Security e Realtime
- TanStack Query, React Hook Form, Zod e date-fns
- Vitest, Testing Library e Playwright
- Vercel para hospedagem da aplicação

## Arquitetura e qualidade

O projeto será desenvolvido como um monólito modular, mantendo as regras de
negócio separadas da interface e da infraestrutura. Segurança, privacidade,
acessibilidade, testes automatizados e entregas incrementais fazem parte da
base do desenvolvimento.

## Status

O Pill.it está na fase inicial de estruturação.

## Executando a base atual

É necessário ter Node.js 20.9 ou superior e npm instalados.

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

Para verificar a qualidade e gerar o build de produção:

```bash
npm run lint
npm run typecheck
npm run build
```
