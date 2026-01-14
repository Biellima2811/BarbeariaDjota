/* script.js */

function enviarWhatsApp(event) {
    event.preventDefault();

    // 1. Pega os dados
    const nome = document.getElementById('clienteNome').value;
    const dia = document.getElementById('dataDia').value;
    const horaString = document.getElementById('dataHora').value;
    
    // 2. Validação de Horário
    if (!validarHorario(dia, horaString)) {
        return; // Para tudo se o horário for inválido
    }

    // 3. Pega serviços selecionados
    let servicosSelecionados = [];
    document.querySelectorAll('.chk-servico:checked').forEach((checkbox) => {
        servicosSelecionados.push(checkbox.value);
    });

    if (servicosSelecionados.length === 0) {
        alert("Por favor, selecione pelo menos um serviço acima!");
        // Rola a página suavemente até a seção de serviços
        document.getElementById('servicos').scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const servicosTexto = servicosSelecionados.join(', ');

    // 4. Monta a mensagem
    // IMPORTANTE: Mantenha o número correto aqui
    const telefoneDjota = "5585991374797"; 
    
    const mensagem = `*💈 NOVO AGENDAMENTO - DJOTA*\n\n` +
                     `👤 *Cliente:* ${nome}\n` +
                     `✂️ *Serviço:* ${servicosTexto}\n` +
                     `📅 *Dia:* ${dia}\n` +
                     `⏰ *Hora:* ${horaString}\n\n` +
                     `Aguarde a confirmação do seu Barbeiro! ...\n\n`+
                     `Obrigado pela preferencia 😁🤝`;

    // 5. Cria o link e abre
    const url = `https://wa.me/${telefoneDjota}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Função auxiliar para converter "14:30" em minutos (ex: 870)
function horaParaMinutos(horaStr) {
    const [hora, minuto] = horaStr.split(':').map(Number);
    return hora * 60 + minuto;
}

function validarHorario(dia, horaStr) {
    const minutos = horaParaMinutos(horaStr);
    
    // Definição dos horários em minutos
    // 09:00 = 540 | 12:00 = 720
    // 16:00 = 960 | 19:00 = 1140 | 19:30 = 1170
    
    let valido = false;
    let mensagemErro = "";

    if (dia === "Segunda-feira") {
        // Seg: 16:00 às 19:30
        if (minutos >= 960 && minutos <= 1170) valido = true;
        else mensagemErro = "Na Segunda, atendemos apenas das 16:00 às 19:30.";
    } 
    else if (dia === "Sábado") {
        // Sáb: 09:00 às 19:00
        if (minutos >= 540 && minutos <= 1140) valido = true;
        else mensagemErro = "No Sábado, atendemos das 09:00 às 19:00.";
    } 
    else {
        // Terça a Sexta
        // Manhã: 09:00 - 12:00 OU Tarde: 16:00 - 19:30
        const manha = (minutos >= 540 && minutos <= 720);
        const tarde = (minutos >= 960 && minutos <= 1170);
        
        if (manha || tarde) valido = true;
        else mensagemErro = "Nesse dia, atendemos das 09h-12h e 16h-19:30h (fechado para almoço).";
    }

    if (!valido) {
        alert("⚠️ Horário Indisponível!\n\n" + mensagemErro);
        return false;
    }
    return true;
}