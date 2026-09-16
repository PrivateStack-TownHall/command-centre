import { APPLICATIONS } from "@/lib/constants";
import {
  APPLICATION_CONFIG,
  type ApplicationId,
} from "@/features/applications/config/application.config";

import Building from "./Building";

interface CityMapProps {
  onSelectApp: (appId: string) => void;
}

/**
 * Grid of application cards, each with its own illustrated building.
 */
function CityMap({ onSelectApp }: CityMapProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {APPLICATIONS.map((app, index) => {
        const config = APPLICATION_CONFIG[app.id as ApplicationId];

        return (
          <Building
            key={app.id}
            app={app}
            color={config.color}
            index={index}
            onClick={() => onSelectApp(app.id)}
          />
        );
      })}
    </div>
  );
}

export default CityMap;
