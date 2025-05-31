// 配置参数
const API_URL = 'http:// 192.168.8.250:5000/api';  // 替换为您的服务器地址
const UPDATE_INTERVAL = 1000;  // 更新间隔（毫秒）

// 状态变量
let lightAuto = false;
let acAuto = false;
let curtainLimitTime = null;
let curtainPosition = 0;

// DOM元素
const elements = {
    temperature: document.getElementById('temperature'),
    humidity: document.getElementById('humidity'),
    light: document.getElementById('light'),
    lightAutoStatus: document.getElementById('light-auto-status'),
    acAutoStatus: document.getElementById('ac-auto-status'),
    limitTime: document.getElementById('limit-time'),
    curtainPosition: document.getElementById('curtain-position'),
    curtainProgress: document.getElementById('curtain-progress')
};

// 按钮事件监听
document.getElementById('light-on').addEventListener('click', () => sendCommand('A'));
document.getElementById('light-off').addEventListener('click', () => sendCommand('B'));
document.getElementById('light-auto').addEventListener('click', () => sendCommand('H'));
document.getElementById('ac-on').addEventListener('click', () => sendCommand('F'));
document.getElementById('ac-off').addEventListener('click', () => sendCommand('G'));
document.getElementById('ac-auto').addEventListener('click', () => sendCommand('I'));
document.getElementById('curtain-open').addEventListener('click', () => sendCommand('C'));
document.getElementById('curtain-stop').addEventListener('click', () => sendCommand('D'));
document.getElementById('curtain-close').addEventListener('click', () => sendCommand('E'));
document.getElementById('curtain-limit').addEventListener('click', () => sendCommand('L'));
document.getElementById('curtain-reset').addEventListener('click', () => sendCommand('R'));

// 发送命令到服务器
async function sendCommand(command) {
    try {
        const response = await fetch(`${API_URL}/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command })
        });
        
        if (!response.ok) {
            throw new Error('命令发送失败');
        }
        
        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        console.error('发送命令错误:', error);
        alert('命令发送失败，请检查网络连接');
    }
}

// 更新状态显示
function updateStatus(data) {
    // 更新传感器数据
    elements.temperature.textContent = `${data.temperature.toFixed(1)} ℃`;
    elements.humidity.textContent = `${data.humidity.toFixed(1)} %`;
    elements.light.textContent = `${data.light} lux`;
    
    // 更新自动状态
    elements.lightAutoStatus.textContent = data.lightAuto ? '开启' : '关闭';
    elements.acAutoStatus.textContent = data.acAuto ? '开启' : '关闭';
    
    // 更新窗帘信息
    if (data.curtainLimitTime) {
        elements.limitTime.textContent = `${data.curtainLimitTime.toFixed(1)} 秒`;
    }
    
    if (data.curtainPosition !== undefined) {
        elements.curtainPosition.textContent = `${data.curtainPosition.toFixed(1)}%`;
        elements.curtainProgress.style.width = `${data.curtainPosition}%`;
    }
}

// 定期更新数据
async function updateData() {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) {
            throw new Error('获取状态失败');
        }
        
        const data = await response.json();
        updateStatus(data);
    } catch (error) {
        console.error('更新数据错误:', error);
    }
}

// 启动定期更新
setInterval(updateData, UPDATE_INTERVAL);
updateData();  // 立即执行一次更新 