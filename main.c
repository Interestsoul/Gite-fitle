#include "gd32f3x0.h"
#include "vsync.h"
#include "m_spi.h"
#include "s_spi.h"
#include "User_app.h"
#include "catch_pwm.h"
#include "key.h"
#include "systick.h"
#include "led.h"
#include "wdog.h"
#include "fault.h"
#include "iw7027driver.h"
#include "iw7027op.h"
#include "adc.h"
#include "time16.h"
//#include <stdio.h>
#include "gd32f3x0_eval.h"
//timer1 ===>VSYNC
//timer14 ===>S_VSYNC
//timer2 ===>catch_pwm



volatile unsigned stabilize;
extern uint8_t  Readbuf[RXBUFFERSIZE];
unsigned char VSYNC_FLAG;
uint8_t first_VSYNC=0;
uint8_t send_flag=0;
uint8_t rec_flag=0;
volatile uint8_t pwm_get=100;
volatile uint8_t pwm_new;
volatile uint8_t operate_mode=0;
volatile uint8_t err7027=0;
volatile uint8_t sys_reset=0;
uint16_t  LedArea=0;
uint8_t fault_count=0;




int main()
{	
	uint16_t count=0;
	uint8_t i=0;
	stabilize=0;
	sys_reset=0;
	
	//主机——与7027通信
		if(OB_USER&OB_VDDA_ENABLE) //检测是否已经配置VDDA检测
		{
			/* unlock the main flash and option byte */
			fmc_unlock();
			ob_unlock();

			/* clear all pending flags */
			fmc_flag_clear(FMC_FLAG_END | FMC_FLAG_WPERR | FMC_FLAG_PGERR);
			ob_erase();
			ob_user_write(OB_VDDA_DISABLE); 
		}
//	systick_config();	 //滴答时钟  delay_1ms()
		
		LED_INIT();//LED引脚配置
		Adc_Init();//ADC功能初始化，检测输入LED电压
		EN_Init();	//Sys_BL_ON 检查	
		BL_ON_INIT();//BL_ON 置高
		Time16_Init();// 中断检测输入电压
		VSYNC_INIT(); //Vsync配置
//	HSYNC_INIT();			
		M_SPI_INIT();  //主SPI配置 与7027通信 复用串口功能     
		timer13_config();  //计算Vsync频率
		WATCH_DOG_INIT();	//看门狗配置
		BUTTON_INIT();//按键
		S_SPI_INIT();	//从SPI配置 与主板通信
		S_VSYNC_INIT();  //捕获主板的VSYNC
		Write_MuitDev_SingleReg(SPI_DEV0,SPI_BLOCK_IC_NUM,WRITE_SAMEDATA_ALL, 0x00,0x06);
		delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);
		delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);
		#if 0
		while(Get_Adc()) //检测LED电压
		{
		 delay_ms(5);
		 sys_reset=0;
		}
		#endif
		IW7027_Init(); //7027 初始化配置
		timer_enable(TIMER16);
		CATCH_PWM_INIT();	//adj通信
		FAULT_INIT();// 报警信号
		sys_reset=0;
		
			while(0)
		
		{	
			delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);	 	 
			if(err7027)
			{
				fault_count++;
				if(fault_count >= 2)
				{
					GPIO_TG(GPIOB) |=1<<1;
					fault_count = 0;
				}
			}
			my_memset((uint16_t *)Light_Value,0x00,sizeof(Light_Value)/sizeof(uint16_t));
			my_memset(&Light_Value[Light_Seq[i]],0xff0f,1);
			i++;
			if(i==32) i=0;
			ReflashLight(); 
		}	
		
#if 1
	while(1)
	{	
	
			
#if 1
		if(sys_reset == 1 )   //电压过低，复位
		{
			count++;
			if(count >= 20)
			{
				count = 0;
				//IWATT_VCC_LOW();
				Write_MuitDev_SingleReg(SPI_DEV0,SPI_BLOCK_IC_NUM,WRITE_SAMEDATA_ALL, 0x00,0x06);
				__set_FAULTMASK(1);   //STM32程序软件复位  
				NVIC_SystemReset();
			}
		}
	#endif
		
		if(operate_mode==0)
		{
			if(err7027)//change by richard on 20191211 添加在任何模式FAULT拉低灯都能闪
			{
				
				fault_count++;
				if(fault_count >= 500)
				{
					GPIO_TG(GPIOB) |=1<<1;
					fault_count = 0;
				}
			}
#if 1
			if(gpio_input_bit_get(GPIOB,GPIO_PIN_5))
			{
					if(SlaveSpiDispose())
					{
						ReflashLight();    		 //刷新亮度数据	
					}
			}	
#endif			
			else 
			{			
					Write_MuitDev_SingleReg(SPI_DEV0,SPI_BLOCK_IC_NUM,WRITE_SAMEDATA_ALL, 0x00,0x06);
				  __set_FAULTMASK(1);   //STM32程序软件复位  
					NVIC_SystemReset();
			}		
		}
		else if(operate_mode==1) //老化模式
		{
				//delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);
				delay_ms(500);				
				if(operate_mode==1)
				{
					if(err7027)
					{
						fault_count++;
						if(fault_count >= 2)
						{
							GPIO_TG(GPIOB) |=1<<1;
							fault_count = 0;
						}
					}
				}
				my_memset(Light_Value,0xff0f,sizeof(Light_Value)/sizeof(uint16_t));				
				ReflashLight();    		 //刷新亮度数据	
		}
		else if(operate_mode==2) //流水灯的模式
		{	
			delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);delay_ms(100);	 	 
			if(err7027)
			{
				fault_count++;
				if(fault_count >= 2)
				{
					GPIO_TG(GPIOB) |=1<<1;
					fault_count = 0;
				}
			}
			my_memset((uint16_t *)Light_Value,0x00,sizeof(Light_Value)/sizeof(uint16_t));
			my_memset(&Light_Value[Light_Seq[i]],0xff0f,1);
			i++;
			if(i==32) i=0;
			ReflashLight(); 
		}	
		
	}	
	#endif
		#if 0
	while(1)
	{
		printf("@_____ReflashLight\n");
		ReflashLight();
		#if 0
		my_memset((uint16_t *)Light_Value,0x00,sizeof(Light_Value)/sizeof(uint16_t));
			Light_Value[Light_Seq[LedArea]]=0xdc05;
			ReflashLight(); 
	            
			delay_ms(500);
			 if(LedArea<(LED_AREA_NUM-1))
			  {
		          LedArea++;
			 }
			 else 
			  {
		            LedArea=0;
			  }
		
		if(SlaveSpiDispose())					
			ReflashLight();  
		#endif
	}
	#endif
	
}


void LVD_IRQHandler(void)
{
    if(RESET != exti_interrupt_flag_get(EXTI_16))
		{
        exti_interrupt_flag_clear(EXTI_16);
				/*IWATT_VCC_LOW();
				__set_FAULTMASK(1);   //STM32程序软件复位  
				NVIC_SystemReset();*/
    }
}

#if 0
/* retarget the C library printf function to the USART */
int fputc(int ch, FILE *f)
{
    usart_data_transmit(EVAL_COM1, (uint8_t) ch);
    while(RESET == usart_flag_get(EVAL_COM1, USART_FLAG_TBE));
    return ch;
}
#endif

