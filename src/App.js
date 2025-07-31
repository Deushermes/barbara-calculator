import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, AlertTriangle, CheckCircle, Phone, User, Building } from 'lucide-react';

const BarbaraCalculator = () => {
  const [formData, setFormData] = useState({
    avgCheck: '',
    clientsTotal: '',
    visitsPerMonth: '',
    sleepingPercent: ''
  });
  
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    salonName: ''
  });

  // КАРДИНАЛЬНАЯ ФИКСАЦИЯ темной темы Telegram
  useEffect(() => {
    // Принудительное отключение темной темы Telegram
    const disableDarkMode = () => {
      document.documentElement.style.filter = 'invert(0)';
      document.body.style.filter = 'invert(0)';
      
      // Создаем мега-агрессивные стили для input
      const inputStyle = document.createElement('style');
      inputStyle.innerHTML = `
        input, input:focus, input:active, input:hover {
          background: white !important;
          background-color: white !important;
          color: black !important;
          -webkit-text-fill-color: black !important;
          -webkit-background-clip: text !important;
          -webkit-appearance: none !important;
          appearance: none !important;
          font-size: 16px !important;
          opacity: 1 !important;
          -webkit-opacity: 1 !important;
        }
        
        input::selection {
          background: #3b82f6 !important;
          color: white !important;
        }
        
        input::-webkit-input-placeholder {
          color: #9ca3af !important;
          -webkit-text-fill-color: #9ca3af !important;
        }
        
        input::-moz-placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(inputStyle);
      
      // Принудительно переопределяем все Telegram переменные
      document.documentElement.style.setProperty('--tg-theme-bg-color', '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', '#000000');
      document.documentElement.style.setProperty('--tg-theme-hint-color', '#9ca3af');
    };

    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.MainButton.hide();

      // Устанавливаем тему
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#ffffff');

      // Принудительно светлая тема
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.setProperty('--tg-theme-bg-color', '#ffffff');
      document.body.style.setProperty('--tg-theme-text-color', '#000000');
    }

    disableDarkMode();
    
    // Повторяем через небольшие задержки для надежности
    setTimeout(disableDarkMode, 100);
    setTimeout(disableDarkMode, 500);
    setTimeout(disableDarkMode, 1000);
    
    // Для диагностики
    setTimeout(() => {
      console.log('Telegram theme:', window.Telegram?.WebApp?.themeParams);
      const input = document.querySelector('input');
      if (input) {
        const styles = window.getComputedStyle(input);
        console.log('Input styles:', {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          WebkitTextFillColor: styles.WebkitTextFillColor
        });
      }
    }, 1000);
  }, []);

  // Расчет потерь в реальном времени (реалистичная формула)
  useEffect(() => {
    const { avgCheck, clientsTotal, visitsPerMonth, sleepingPercent } = formData;
    
    if (avgCheck && clientsTotal && visitsPerMonth && sleepingPercent) {
      // Реалистичный месячный оборот салона
      const theoreticalRevenue = parseFloat(avgCheck) * parseFloat(clientsTotal) * parseFloat(visitsPerMonth);
      const estimatedMonthlyRevenue = Math.min(
        theoreticalRevenue * 0.3, // Не все клиенты активны каждый месяц
        1200000 // Максимум 1.2М для среднего салона
      );
      
      // Потери от спящих клиентов (реалистично)
      const monthlyLoss = estimatedMonthlyRevenue * (parseFloat(sleepingPercent) / 100) * 0.25;
      const yearlyLoss = monthlyLoss * 12;
      
      // Сколько можно вернуть с Barbara AI (40% от спящих)
      const recoveredRevenue = yearlyLoss * 0.4;
      const systemCost = 60000; // ~5К в месяц
      const netProfit = recoveredRevenue - systemCost;
      const roi = netProfit > 0 ? ((netProfit / systemCost) * 100) : 0;
      
      setResults({
        monthlyLoss: Math.round(monthlyLoss),
        yearlyLoss: Math.round(yearlyLoss),
        recoveredRevenue: Math.round(recoveredRevenue),
        netProfit: Math.round(netProfit),
        roi: Math.round(roi)
      });
    } else {
      setResults(null);
    }
  }, [formData]);

  const handleInputChange = (field, value) => {
    // Разрешаем только цифры
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
    
    // ХАК: Принудительно обновляем стили input после изменения
    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        input.style.color = '#000000';
        input.style.backgroundColor = '#ffffff';
        input.style.webkitTextFillColor = '#000000';
        // Принудительный reflow
        void input.offsetHeight; // Принудительный reflow
      });
    }, 10);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const handleCalculate = () => {
    if (results) {
      setShowResults(true);
      
      // Отправляем данные в Telegram Bot
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
          ...formData,
          ...results,
          timestamp: new Date().toISOString()
        }));
      }
    }
  };

  const handleContactSubmit = () => {
    if (contactData.name && contactData.phone) {
      // Отправляем контактные данные в бот
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.sendData(JSON.stringify({
          type: 'contact',
          ...contactData,
          calculatorData: { ...formData, ...results },
          timestamp: new Date().toISOString()
        }));
      }
      
      // Показываем успешное сообщение
      alert('Спасибо! Мы свяжемся с вами в течение 2 часов.');
      window.Telegram?.WebApp?.close();
    }
  };

  // МЕГА-АГРЕССИВНЫЕ стили для input полей 
  const inputStyles = {
    backgroundColor: '#ffffff !important',
    color: '#000000 !important',
    WebkitTextFillColor: '#000000 !important',
    border: '2px solid #d1d5db',
    fontSize: '18px', // Увеличиваем для лучшей видимости
    fontWeight: '500',
    textShadow: 'none',
    WebkitBackgroundClip: 'text',
    WebkitAppearance: 'none',
    appearance: 'none',
    opacity: '1 !important',
    WebkitOpacity: '1 !important',
  };

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                КРИТИЧЕСКАЯ СИТУАЦИЯ!
              </h2>
              <p className="text-gray-600">
                Ваши потери: <span className="font-bold text-red-600">{formatNumber(results?.yearlyLoss)}₽ в год</span>
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                С Barbara AI вы получите:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700">+{formatNumber(results?.recoveredRevenue)}₽ дополнительно в год</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700">ROI системы: {results?.roi}%</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700">Возврат 40% "спящих" клиентов</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  value={contactData.name}
                  onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                  style={inputStyles}
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Телефон *
                </label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                  style={inputStyles}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Название салона
                </label>
                <input
                  type="text"
                  value={contactData.salonName}
                  onChange={(e) => setContactData(prev => ({ ...prev, salonName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                  style={inputStyles}
                  placeholder="Название вашего салона"
                />
              </div>
            </div>

            <button
              onClick={handleContactSubmit}
              disabled={!contactData.name || !contactData.phone}
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            >
              🔥 ПОЛУЧИТЬ ДЕМО ПРЯМО СЕЙЧАС
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              {results?.yearlyLoss > 2000000 ? 
                "⚡ Потери свыше 2М₽ - звоним в течение 30 минут!" :
                "📞 Свяжемся с вами в течение 2 часов"
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <TrendingDown className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-2">
                ⚠️ ВАШИ ПОТЕРИ
              </h2>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-500">
                <p className="text-sm text-red-700 mb-1">В месяц теряете:</p>
                <p className="text-2xl font-bold text-red-800">{formatNumber(results.monthlyLoss)}₽</p>
              </div>

              <div className="bg-red-100 rounded-xl p-4 border-l-4 border-red-600">
                <p className="text-sm text-red-700 mb-1">В год теряете:</p>
                <p className="text-3xl font-bold text-red-900">{formatNumber(results.yearlyLoss)}₽</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-500">
                <p className="text-sm text-orange-700 mb-1">За 3 года потери:</p>
                <p className="text-2xl font-bold text-orange-800">{formatNumber(results.yearlyLoss * 3)}₽</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                🚀 С Barbara AI вы вернете:
              </h3>
              <div className="space-y-2">
                <p className="text-green-700">
                  <span className="font-semibold">40% спящих клиентов</span>
                </p>
                <p className="text-green-700">
                  <span className="font-semibold">+{formatNumber(results.recoveredRevenue)}₽</span> дополнительно в год
                </p>
                <p className="text-green-700">
                  ROI системы: <span className="font-semibold">{results.roi}%</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowContactForm(true)}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 mb-4"
            >
              💰 ВЕРНУТЬ ДЕНЬГИ ПРЯМО СЕЙЧАС
            </button>

            <button
              onClick={() => {
                setShowResults(false);
                setFormData({ avgCheck: '', clientsTotal: '', visitsPerMonth: '', sleepingPercent: '' });
              }}
              className="w-full bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200"
            >
              🔄 Пересчитать для другого салона
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              💰 Калькулятор потерь салона
            </h1>
            <p className="text-gray-600">
              Узнайте сколько денег теряет ваш салон на "спящих" клиентах
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Средний чек услуги (₽)
              </label>
              <input
                type="text"
                value={formData.avgCheck}
                onChange={(e) => handleInputChange('avgCheck', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                style={inputStyles}
                placeholder="2500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Клиентов в базе (чел)
              </label>
              <input
                type="text"
                value={formData.clientsTotal}
                onChange={(e) => handleInputChange('clientsTotal', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                style={inputStyles}
                placeholder="1200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Визитов клиента в месяц
              </label>
              <input
                type="text"
                value={formData.visitsPerMonth}
                onChange={(e) => handleInputChange('visitsPerMonth', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                style={inputStyles}
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                % "спящих" клиентов (&gt;3 мес)
              </label>
              <input
                type="text"
                value={formData.sleepingPercent}
                onChange={(e) => handleInputChange('sleepingPercent', e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg transition-all duration-200"
                style={inputStyles}
                placeholder="35"
              />
            </div>
          </div>

          {results && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-700 mb-1">Предварительные потери в год:</p>
              <p className="text-xl font-bold text-red-800">{formatNumber(results.yearlyLoss)}₽</p>
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={!results}
            className="w-full mt-6 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            {results ? '⚡ РАССЧИТАТЬ ПОТЕРИ' : '⏳ Заполните все поля'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Расчет займет 30 секунд. Результат может вас шокировать.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarbaraCalculator;
