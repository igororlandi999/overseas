📁 calculadora-importacao/
├── 📄 index.html                    # Estrutura HTML principal
├── 📄 styles.css                    # Todos os estilos CSS
├── 📄 ncms.json                     # Base de dados com 11k+ NCMs
├── 📁 js/
│   ├── 📄 app.js                    # Controlador principal e inicialização
│   ├── 📄 calculadora.js            # Lógica de cálculos e regras de negócio
│   ├── 📄 ncm.js                    # Gerenciamento de NCMs (validação, UI)
│   ├── 📄 ui.js                     # Manipulação da interface (resultados, notificações)
│   ├── 📄 storage.js                # Gerenciamento do localStorage
│   └── 📄 utils.js                  # Utilitários de formatação e validação
└── 📄 README.md                     # Documentação do projeto

🎯 ARQUITETURA MODULAR:

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   index.html    │    │   styles.css    │    │   ncms.json     │
│                 │    │                 │    │                 │
│ • Estrutura DOM │    │ • Dark theme    │    │ • 11k+ NCMs     │
│ • Formulários   │    │ • Responsivo    │    │ • Alíquotas     │
│ • Seções        │    │ • Animações     │    │ • Descrições    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │     app.js      │
                    │                 │
                    │ • Inicialização │
                    │ • Coordenação   │
                    │ • Event handlers│
                    │ • Debug utils   │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  calculadora.js │    │     ncm.js      │    │     ui.js       │
│                 │    │                 │    │                 │
│ • Cálculos      │    │ • Carregamento  │    │ • Resultados    │
│ • Tributos      │    │ • Validação     │    │ • Notificações  │
│ • Regras negócio│    │ • Interface NCM │    │ • Export PDF    │
│ • Validações    │    │ • Normalização  │    │ • Contato       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐
│   storage.js    │    │    utils.js     │
│                 │    │                 │
│ • localStorage  │    │ • Formatação    │
│ • Auto-save     │    │ • Validações    │
│ • Backup/Import │    │ • Utilitários   │
│ • Preferências  │    │ • Logs/Debug    │
└─────────────────┘    └─────────────────┘

🔄 FLUXO DE DADOS:

1. 📥 ENTRADA:
   index.html → app.js → FormManager.collectData() → NCMManager.collectData()

2. ⚙️ PROCESSAMENTO:
   app.js → CalculadoraImportacao.calcular() → NCMLoader.getDatabase()

3. 📊 VALIDAÇÃO:
   ImportacaoValidator.validate() → ValidationUtils (utils.js)

4. 🧮 CÁLCULOS:
   calculadora.js → CONFIG → tributos/custos/totais/economia

5. 📤 SAÍDA:
   ResultsManager.display() → UIManager → DOM updates

6. 💾 PERSISTÊNCIA:
   StorageManager → localStorage → auto-save/manual save

🎛️ MÓDULOS E RESPONSABILIDADES:

📄 app.js - CONTROLADOR PRINCIPAL
├── AppController: Orquestração geral
├── FormManager: Coleta/preenchimento de dados
├── DebugUtils: Funções de teste e debug
└── Event handlers e inicialização

📄 calculadora.js - MOTOR DE CÁLCULOS
├── CalculadoraImportacao: Cálculos principais
├── ImportacaoValidator: Validações de negócio
├── CONFIG: Constantes e configurações
└── Regras tributárias e operacionais

📄 ncm.js - GESTÃO DE NCMs
├── NCMLoader: Carregamento da base JSON
├── NCMManager: Interface e validação de NCMs
├── Normalização de códigos
└── Validação em tempo real

📄 ui.js - INTERFACE DO USUÁRIO
├── UIManager: Controles gerais da UI
├── NotificationManager: Sistema de notificações
├── ResultsManager: Exibição de resultados
├── ContactManager: Integração WhatsApp
└── ExportManager: Geração de relatórios

📄 storage.js - PERSISTÊNCIA
├── StorageManager: localStorage operations
├── Auto-save com debounce
├── Backup/restore de dados
└── Gestão de preferências

📄 utils.js - UTILITÁRIOS
├── FormatUtils: Formatação de valores
├── ValidationUtils: Validações genéricas
├── DataUtils: Manipulação de dados
└── LogUtils: Sistema de logs

🚀 BENEFÍCIOS DA REFATORAÇÃO:

✅ MANUTENIBILIDADE
• Cada arquivo tem responsabilidade única
• Fácil localização de bugs e features
• Código mais legível e documentado

✅ ESCALABILIDADE
• Novos módulos podem ser adicionados facilmente
• Sistema de importação/exportação entre módulos
• Estrutura preparada para crescimento

✅ TESTABILIDADE
• Funções isoladas e testáveis
• Mocks e stubs mais fáceis
• Debug utilities integradas

✅ PERFORMANCE
• Carregamento modular
• Tree-shaking possível
• Cache de módulos pelo navegador

✅ COLABORAÇÃO
• Diferentes devs podem trabalhar em módulos específicos
• Merge conflicts reduzidos
• Padrões de código consistentes

🔧 COMO USAR:

1. Salve cada arquivo na estrutura mostrada
2. Mantenha o ncms.json na raiz
3. Abra index.html em um servidor local
4. Use as funções de debug no console:
   • testarCalculadora()
   • verificarNCM('12345678')
   • listarNCMs()
   • salvarDados()
   • carregarDados()
   • limparFormulario()

⚡ FUNCIONALIDADES PRESERVADAS:

• 100% da lógica original mantida
• Validação em tempo real de NCMs
• Cálculos precisos baseados na planilha
• Auto-save e persistência de dados
• Export para PDF/impressão
• Sistema de notificações
• Responsividade e dark theme
• Integração WhatsApp
• Base de 11k+ NCMs