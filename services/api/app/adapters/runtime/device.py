import os
import platform
import psutil
from typing import Dict, Any


class RuntimeDeviceManager:
    """Inspects host device capabilities, resource utilization, and offline readiness."""

    @staticmethod
    def get_device_info() -> Dict[str, Any]:
        mem = psutil.virtual_memory()
        return {
            "os": f"{platform.system()} {platform.release()}",
            "cpu_cores": os.cpu_count() or 1,
            "ram_gb_total": round(mem.total / (1024 ** 3), 2),
            "ram_gb_available": round(mem.available / (1024 ** 3), 2),
            "cpu_percent": psutil.cpu_percent(interval=None),
        }

    @staticmethod
    def is_offline_mode(configured_mode: str) -> bool:
        """Verify whether system is operating in strictly local/offline configuration."""
        return configured_mode.lower() == "local"

    @staticmethod
    def sample_resource_metrics() -> Dict[str, Any]:
        process = psutil.Process()
        mem_info = process.memory_info()
        return {
            "process_ram_mb": round(mem_info.rss / (1024 * 1024), 2),
            "system_ram_percent": psutil.virtual_memory().percent,
            "system_cpu_percent": psutil.cpu_percent(interval=None),
        }
